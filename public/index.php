<?php
require '../vendor/autoload.php';
require '../config.php';

// Prepare app
$app = new \Slim\Slim(array(
    'templates.path' => '../templates',
    'log.level' => 4,
    'log.enabled' => true,
    'log.writer' => new \Slim\Extras\Log\DateTimeFileWriter(array(
        'path' => '../logs',
        'name_format' => 'y-m-d'
    )),
    'custom' => $config
));

$app->setName('API');


// Prepare view
\Slim\Extras\Views\Twig::$twigOptions = array(
    'charset' => 'utf-8',
    'cache' => realpath('../templates/cache'),
    'auto_reload' => true,
    'strict_variables' => false,
    'autoescape' => true
);
$app->view(new \Slim\Extras\Views\Twig());

// Define routes for home documentation
$app->get('/', function () use ($app) {
    $app->render('index.html');
});


// Define routes for API request
$app->get('/docs', function () use ($app) {
  // get type of document: pp, spp or se
  $request = $app->request();
  
  // get site and db config
  $config = $app->config('custom');
  
  // inject assets uri
  $assetUri = $app->request()->getRootUri();
  $app->view()->appendData(array(
      'assetUri' => $assetUri
  ));
  
  // Get Querystring parameters
  $cari = $request->get('term');
  $jenis = $request->get('type');
  $tahun = $request->get('year');
  $kategori = $request->get('cat');
  $teras = $request->get('core');
  $format = $request->get('format');
  $callback = $request->get('callback');
  
  // pagination
  $page = $request->get('page');
  $page = (!empty($page)) ? $page : 1;
  $row_per_page = $request->get('row');
  $row_per_page = (!empty($row_per_page)) ? $row_per_page : 10;
  $offset =($page > 1) ? intval(($page - 1) * $row_per_page) : 0;
  
  $jenis = ($jenis === 'se') ? 3 : (($jenis === 'spp') ? 2 : 1); //default to 1 (pp)

  $fpdo = new FluentPDO(new PDO("mysql:host=". $config['db']['host'] .";dbname=".$config['db']['name'], $config['db']['user'], $config['db']['pass']));
  
  $query = $fpdo->from('dokumen');
  
  if (!empty($cari)) {
    $query = $query->where('tajuk LIKE ?', '%'.$cari.'%');
  }
  
  if (!empty($tahun)) {
    $query = $query->where('tahun = ?', $tahun);
  }
  
  if (!empty($kategori)) {
    $query = $query->where('hubungan:kategori.id', $kategori)->select('kategori.kategori');
  } else {
    $query = $query->select('hubungan:kategori.kategori');
  }

  if (!empty($teras)) {
    $query = $query->where('hubungan:teras.id', $teras)->select('teras.teras');
  } else {
    $query = $query->select('hubungan:teras.teras');
  }

  $query = $query->where('hubungan:jenis.id', $jenis);
  
  $query = $query->orderBy('tahun DESC');
  $row_count = count($query->fetchAll());
  $query = $query->limit($row_per_page);
  $query = $query->offset($offset);
  $document =$query->fetchAll();
  
  $result = array();
  
  switch ($format) {
    case "html":
      
      echo "Senarai $jenis HTML";
      $app->render('slim.html.twig');
      break;
    default:
      $res = $app->response();
      $res['Content-Type'] = 'application/json';
      $res['X-API-Version'] = '1.0';
      
      if (empty($document)) {
        echo json_encode(array('204' => 'No Content'));
      } else {
        $result['result'] = $document;
        // support callback for jsonp
        if (!empty($callback)) {
          $res['Content-Type'] = 'application/javascript';
          echo htmlspecialchars($callback) . '(' . json_encode($result) . ');';
        } else {
          echo json_encode($result);
        }
      }
      break;
  }
});

// Run app
$app->run();
