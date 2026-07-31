<?php
/**
 * CCC 2026 registration backend — shared helpers (PHP, for Hostinger or any
 * standard PHP hosting). Registrations are stored in ../data/registrations.json.
 */

// ---- Configuration (change for production!) ----
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'EffexCCC2026!';
const ADMIN_SECRET = 'effex-ccc-2026-change-this-secret';
const TOKEN_TTL = 28800; // 8 hours

define('DATA_DIR', __DIR__ . '/../data');
define('DATA_FILE', DATA_DIR . '/registrations.json');

function send_json($obj, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json');
  header('Cache-Control: no-store');
  echo json_encode($obj, JSON_UNESCAPED_UNICODE);
  exit;
}

function read_body(): array {
  $raw = file_get_contents('php://input');
  if ($raw === false || $raw === '') return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function clean_str($v, int $max = 2000): string {
  if (!is_string($v)) return '';
  $v = trim($v);
  // Prefer multibyte-safe truncation when available.
  return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}

// Case-insensitive "contains" that works with or without the mbstring extension.
function str_contains_ci(string $haystack, string $needle): bool {
  if ($needle === '') return true;
  return function_exists('mb_stripos')
    ? mb_stripos($haystack, $needle) !== false
    : stripos($haystack, $needle) !== false;
}

// ---- Storage (file-locked so concurrent sign-ups don't lose data) ----
function load_registrations(): array {
  if (!is_file(DATA_FILE)) return [];
  $raw = file_get_contents(DATA_FILE);
  $data = json_decode($raw ?: '[]', true);
  return is_array($data) ? $data : [];
}

function append_registration(array $entry): bool {
  if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0755, true);
  $fp = fopen(DATA_FILE, 'c+');
  if (!$fp) return false;
  if (!flock($fp, LOCK_EX)) { fclose($fp); return false; }
  $raw = stream_get_contents($fp);
  $list = json_decode($raw ?: '[]', true);
  if (!is_array($list)) $list = [];
  $list[] = $entry;
  rewind($fp);
  ftruncate($fp, 0);
  fwrite($fp, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);
  return true;
}

// ---- Ticket id ----
function gen_ticket_id(): string {
  $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  $s = '';
  for ($i = 0; $i < 10; $i++) $s .= $chars[random_int(0, strlen($chars) - 1)];
  return $s;
}

// ---- Stateless signed tokens (HMAC), same scheme as the Netlify functions ----
function b64url(string $bin): string {
  return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}
function b64url_decode(string $str): string {
  return base64_decode(strtr($str, '-_', '+/'));
}

function make_token(): string {
  $payload = b64url(json_encode(['exp' => (time() + TOKEN_TTL) * 1000]));
  $sig = b64url(hash_hmac('sha256', $payload, ADMIN_SECRET, true));
  return $payload . '.' . $sig;
}

function verify_token(?string $token): bool {
  if (!$token || strpos($token, '.') === false) return false;
  [$payload, $sig] = explode('.', $token, 2);
  $expected = b64url(hash_hmac('sha256', $payload, ADMIN_SECRET, true));
  if (!hash_equals($expected, $sig)) return false;
  $data = json_decode(b64url_decode($payload), true);
  return is_array($data) && isset($data['exp']) && ($data['exp'] / 1000) > time();
}

function bearer_token(): ?string {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
  if (preg_match('/^Bearer\s+(.+)$/i', $hdr, $m)) return trim($m[1]);
  return null;
}

function require_auth(): void {
  if (!verify_token(bearer_token())) send_json(['error' => 'Unauthorized'], 401);
}
