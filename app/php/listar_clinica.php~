<?php
header('Access-Control-Allow-Origin: *');
/* Database connection information */
include("mysql.php" );
/*
 * Local functions
 */
function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}
/*
 * MySQL connection
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}
if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}
mysql_query('SET names utf8');

//Recogemos los datos

$id = $_POST["idDoctor"];
$nombre = $_POST["nombre"];
$numcolegiado = $_POST["numcolegiado"];
$clinicas = $_POST["id_clinica"];

// Primero habrá que borrar la relacion clinica doctores
if (!empty($clinicas))
{
  $query0 = "delete from clinica_doctor where id_doctor=".$id;
  $query_res0 = mysql_query($query0);
  if (!$query_res0) {
    $mensaje0  = 'Error en la consulta al borrar los doctores: ' . mysql_error() ;
    $estado0 = mysql_errno();    
  }
  else
  {
    $mensaje0 = "Actualización correcta";
    $estado0 = 0;
  }

  // Por cada clinica que haya recibido del formulario ejecutara la sentencia

  for ($i=0;$i<count($clinicas);$i++)    
  {     
    $query1 = "insert into clinica_doctor (id_doctor,id_clinica) values( ". $id . ", " . $clinicas[$i] . ")" ;
    $query_res1 = mysql_query($query1);
    if (!$query_res1) {
      $mensaje1  = 'Error en la consulta al insertar los datos en clinica_doctor: ' . mysql_error() ;
      $estado1 = mysql_errno();    
    }
    else
    {
      $mensaje1 = "Actualización correcta";
      $estado1 = 0;
    }
  }
}
else
{
  $mensaje3="El valor de clinicas no ha sido pasado";
} 
/* Consulta UPDATE */
$query2 = "UPDATE doctores SET 
            nombre = '" . $nombre . "', 
            numcolegiado = '" . $numcolegiado . "' 
            WHERE id_doctor = '" . $id."'";
$query_res2 = mysql_query($query2);
// Comprobar el resultado
if (!$query_res2) {
    $mensaje  = 'Error al actualizar los datos del doctor: ' . mysql_error() ;
    $estado = mysql_errno();    
}
else
{
    $mensaje2 = "Actualización correcta";
    $estado2 = 0;
}
$resultado = array();
 $resultado[] = array(
      'mensaje0' => $mensaje0,
      'estado0' => $estado0,
      'mensaje1' => $mensaje1,
      'estado1' => $estado1,
      'mensaje2' => $mensaje2,
      'estado2' => $estado2,
      'mensaje3' => $mensaje3
   );
echo json_encode($resultado);
?>