<?php
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  send_json(['error' => 'Method Not Allowed'], 405);
}

$body = read_body();
$fullName = clean_str($body['fullName'] ?? '', 200);
$email = clean_str($body['email'] ?? '', 200);
$phone = clean_str($body['phone'] ?? '', 60);
$reason = clean_str($body['reason'] ?? '', 4000);

if ($fullName === '' || $email === '' || $phone === '' || $reason === '') {
  send_json(['error' => 'All fields are required.'], 400);
}
if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
  send_json(['error' => 'Please provide a valid email address.'], 400);
}

$entry = [
  'id' => bin2hex(random_bytes(16)),
  'ticketId' => gen_ticket_id(),
  'fullName' => $fullName,
  'email' => $email,
  'phone' => $phone,
  'reason' => $reason,
  'createdAt' => gmdate('Y-m-d\TH:i:s\Z'),
];

if (!append_registration($entry)) {
  send_json(['error' => 'Could not save your registration. Please try again.'], 500);
}

send_json(['ok' => true, 'ticketId' => $entry['ticketId'], 'id' => $entry['id']], 201);
