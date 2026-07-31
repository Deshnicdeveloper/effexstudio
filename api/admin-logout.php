<?php
require __DIR__ . '/lib.php';
// Tokens are stateless — logout is client-side (discard the token).
send_json(['ok' => true]);
