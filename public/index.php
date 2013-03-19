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
//$app->get('/pp(/)(/:tahun/?(/:kategori/?(/:teras/?)))', 'getPP');
//$app->get('/spp(/)(/:tahun/?(/:kategori/?(/:teras/?)))', 'getSPP');
//$app->get('/se(/)(/:tahun/?(/:kategori/?(/:teras/?)))', 'getSE');

$app->get('/cari/:query', function () {
    //$app->render('search.html');
});
/*
$app->get('/docs/?(/:tahun/?(/:kategori/?(/:teras/?)))', function ($type = 'pp', $tahun = null, $kategori = null, $teras = null) use ($app) {
  // get type of document: pp, spp or se
  $type = ($type === 'se') ? 3 : (($type === 'spp') ? 2 : 1); //default to 1 (pp)
  
  echo "Senarai $type";
});
*/

$app->get('/docs', function () use ($app) {
  // get type of document: pp, spp or se
  $request = $app->request();
  $config = $app->config('custom');
  
  $cari = $request->get('term');
  $jenis = $request->get('type');
  $tahun = $request->get('year');
  $kategori = $request->get('cat');
  $teras = $request->get('core');
  $format = $request->get('format');
  
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
      $app->render('index.html');
      break;
    default:
      echo "Senarai $jenis JSON";
      break;
  }
  
  //print_r($document);
  
  
});


// Run app
$app->run();



function getJenis() {

  $type = isset($_GET['type']) ? htmlEntities($_GET['type'], ENT_QUOTES) : 1;
  $type = isset($type) ? (($type === 'pp') ? 1 : (($type === 'spp') ? 2 : 3)) : 1;  // pp: 1, spp: 2, se: 3

  
   $fpdo = new FluentPDO(getConnection());
  $query = $fpdo->from('dokumen');
  $document = $query->fetchAll();
  
  if (!isset($_GET['callback'])) {
    echo json_encode($document);
  } else {
    echo $_GET['callback'] . '(' . json_encode($document) . ');';
  }
}