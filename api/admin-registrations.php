<?php
require __DIR__ . '/lib.php';
require_auth();

$items = load_registrations();

// Optional search by name / email / phone.
$q = trim($_GET['q'] ?? '');
if ($q !== '') {
  $items = array_values(array_filter($items, function ($r) use ($q) {
    return str_contains_ci($r['fullName'] ?? '', $q)
        || str_contains_ci($r['email'] ?? '', $q)
        || str_contains_ci($r['phone'] ?? '', $q);
  }));
}

$totalAll = count(load_registrations());

// Alphabetical by name, case-insensitive.
usort($items, function ($a, $b) {
  return strcasecmp($a['fullName'] ?? '', $b['fullName'] ?? '');
});

// Pagination — 20 per page.
$perPage = 20;
$total = count($items);
$totalPages = max(1, (int)ceil($total / $perPage));
$page = (int)($_GET['page'] ?? 1);
if ($page < 1) $page = 1;
if ($page > $totalPages) $page = $totalPages;

$pageItems = array_slice($items, ($page - 1) * $perPage, $perPage);

send_json([
  'ok' => true,
  'page' => $page,
  'perPage' => $perPage,
  'total' => $total,
  'totalPages' => $totalPages,
  'totalAll' => $totalAll,
  'items' => $pageItems,
]);
