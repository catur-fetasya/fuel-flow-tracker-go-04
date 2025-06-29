
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/ProfileController.php';
require_once 'controllers/UnitController.php';
require_once 'controllers/LogController.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/backend', '', $path);

// Remove leading slash
$path = ltrim($path, '/');

// Split path into segments
$segments = explode('/', $path);

try {
    switch ($segments[0]) {
        case 'api':
            handleApiRequest($segments, $method);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleApiRequest($segments, $method) {
    $endpoint = $segments[1] ?? '';
    
    switch ($endpoint) {
        case 'login':
            $controller = new AuthController();
            $controller->login();
            break;
        case 'register':
            $controller = new AuthController();
            $controller->register();
            break;
        case 'profile':
            $controller = new ProfileController();
            if ($method === 'GET') {
                $id = $segments[2] ?? null;
                $controller->getProfile($id);
            }
            break;
        case 'profiles':
            $controller = new ProfileController();
            if ($method === 'GET') {
                $controller->getAllProfiles();
            } elseif ($method === 'POST') {
                $controller->createProfile();
            }
            break;
        case 'units':
            $controller = new UnitController();
            if ($method === 'GET') {
                $controller->getAllUnits();
            } elseif ($method === 'POST') {
                $controller->createUnit();
            }
            break;
        case 'loading-logs':
            $controller = new LogController();
            $controller->createLoadingLog();
            break;
        case 'segel-logs':
            $controller = new LogController();
            $controller->createSegelLog();
            break;
        case 'keluar-pertamina-logs':
            $controller = new LogController();
            $controller->createKeluarPertaminaLog();
            break;
        case 'dokumen-logs':
            $controller = new LogController();
            $controller->createDokumenLog();
            break;
        case 'pengawas-depo-logs':
            $controller = new LogController();
            $controller->createPengawasDepoLog();
            break;
        case 'fuelman-logs':
            $controller = new LogController();
            if ($method === 'GET') {
                $controller->getFuelmanLogs();
            } elseif ($method === 'POST') {
                $controller->createFuelmanLog();
            }
            break;
        case 'logs-by-unit':
            $controller = new LogController();
            $unitId = $segments[2] ?? null;
            $controller->getLogsByUnit($unitId);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
}
?>
