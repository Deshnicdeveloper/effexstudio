<?php
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  send_json(['error' => 'Method Not Allowed'], 405);
}

$body = read_body();
$username = clean_str($body['username'] ?? '', 100);
$password = clean_str($body['password'] ?? '', 200);

if ($username === ADMIN_USER && $password === ADMIN_PASS) {
  send_json(['ok' => true, 'token' => make_token()]);
}
send_json(['error' => 'Invalid username or password.'], 401);
