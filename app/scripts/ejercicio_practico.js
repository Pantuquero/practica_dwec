   'use strict';
   $(document).ready(function() {
       var miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           //'ajax': 'http://localhost/practica-ajax-datatables/app/php/cargar_doctores.php',
           'ajax': 'php/cargar_doctores.php',
           //'ajax': 'http://localhost/html/practica-ajax-datatables/app/php/cargar_doctores.php',
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           },
           'columns': [{
               'data': 'idDoctor'
           }, {
               'data': 'nombre'
           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'idClinicas'
           }, {
               'data': 'nombreclinicas'
           }, {
               'data': 'nombre',
               /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
               botón de edición o borrado*/
               'render': function(data) {
                   //return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_doctores.php?id_doctor=' + data + '>Editar</a>';
                   //return '<a class="btn btn-primary editarbtn" href=http://localhost/html/php/modificar_doctores.php?id_doctor=' + data + '>Editar</a>';
                   return '<a class="btn btn-primary editarbtn" href=http://www.aalvarez.infenlaces.com/Juanda/datatables2/php/modificar_doctores.php?id_doctor=' + data + '>Editar</a>';
               }
           }, {
               'data': 'nombre',
               'render': function(data) {
                   //return '<a class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>'
                   //return '<a class="btn btn-warning borrarbtn" href=http://localhost/html/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>'
                   return '<a class="btn btn-warning borrarbtn" href=http://www.aalvarez.infenlaces.com/Juanda/datatables2/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>'
               }
           }],
           'columnDefs': [{
               'targets': [0],
               'visible': false,
           }, {
               "targets": [3],
               "visible": false,
           }, {
                "targets": [5,6],
                "orderable": false
           }],
       });
        /* Usamos esto para cargar las clinicas de los doctores */
       function cargarClinicas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_clinica.php',
               //url: 'http://localhost/practica-ajax-datatables/app/php/listar_clinica.php',
               //url: 'http://localhost/html/practica-ajax-datatables/app/php/listar_clinica.php',
               
               //estos son los datos que queremos actualizar, en json:
               // {parametro1: valor1, parametro2, valor2, ….}
               //data: { id_doctor: idDoctor, nombre: nombre, ….,  id_clinica: idClinica },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
               },
               success: function(data) {
                   $('#id').empty();
                   $.each(data, function() {
                       $('#clinicas').append(
                           $('<option></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       };
       /*Creamos la función que muestre el formulario cuando hagamos click*/
       /*ojo, es necesario hacerlo con el método ON. Tanto por rendimiento como porque puede haber elementos (botones) que todavía no existan en el document.ready*/
       $('#miTabla').on('click', '.editarbtn', function(e) {
           
           e.preventDefault();

           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idDoctor').val(aData.idDoctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
           $('#idClinicas').val(aData.idClinicas);
           //$('#clinicas').val(aData.nombreClinica);
          // var prueba=$('#idClinica').val(aData.idDoctor);
           
           
           
          // alert(aData.idClinica);
          //selecciono las que estaban
          

          var str =  aData.idClinicas;
          var res = str.split(",");

          //cargo el select con las que ya estaban
          $('#clinicas').val(res);

       });
       cargarClinicas();
       $('#creaDoc').click(function(e) {
           e.preventDefault();
           //oculto tabla muestro form
           $('#tabla').fadeOut(100);
           $('#formularioCrear').fadeIn(100);
           // limpio la tabla por si ya se ha creado algun doctor antes
           $('#nombreNuevo').val(null);
           $('#numcolegiadoNuevo').val(null);
           $('#clinicasNuevas').val(null);
       });

       $('#miTabla').on('click', '.borrarbtn', function(e) {
           e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var idDoctor = aData.idDoctor;
           var nombredoctor = aData.nombre;
           var confirmacion = confirm('Se va a borrar al doctor '+nombredoctor+' ¿Estas seguro?')
           if (confirmacion == true)
           {
           $.ajax({
               /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
               type: 'POST',
               dataType: 'json',
               url: 'php/borrar_doctor.php',
               //url: 'http://localhost/practica-ajax-datatables/app/php/borrar_doctor.php',
               //url: 'http://localhost/html/practica-ajax-datatables/app/php/borrar_doctor.php',
               
               //estos son los datos que queremos actualizar, en json:
               data: {
                   id_doctor: idDoctor
               },
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
                   var $mitabla = $("#miTabla").dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               },
               success: function(data) {
                   var $mitabla = $("#miTabla").dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               },
               complete: {
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
          //alert ('Se ha borrado al doctor '+nombredoctor+' con exito.');
               $.growl.notice({title: "!Atención!", message: "Doctor borrado con éxito" });
          }
          else
          {
            $.growl.notice({title: "!Atención!", message: "El doctor no se ha borrado" });
          }
       });
       $('#enviar').click(function(e) {
           e.preventDefault();
           var idDoctor;
           var nombre;
           var numcolegiado;
           var id_clinica;
           idDoctor = $('#idDoctor').val();
           nombre = $('#nombre').val();
           numcolegiado = $('#numcolegiado').val();
           id_clinica = $('#clinicas').val();
           var confirmacion = confirm('Se va a modificar los datos del doctor '+nombre+' ¿Estas seguro?')
           if (confirmacion == true)
           {
              $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'php/modificar_doctores.php',
                //url: 'http://localhost/practica-ajax-datatables/app/php/modificar_doctores.php',
                //url: 'http://localhost/html/practica-ajax-datatables/app/php/modificar_doctores.php',
                data: {
                  idDoctor: idDoctor,
                  nombre: nombre,
                  numcolegiado: numcolegiado,
                  id_clinica:id_clinica                
                },
                error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
                   //alert("Ha entrado en error");
                    //$.growl.error({title:"Error", message: error });
                    var $mitabla = $("#miTabla").dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                },
                success: function(data) {
                  var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
                  $mitabla.fnDraw();           
                },
                complete: {
                   //si queremos hacer algo al terminar la petición ajax
                }
                });
              //alert('Se ha editado al doctor '+nombre+' con exito');
               $.growl.notice({title:"¡Atención!", message: "Doctor modificado con éxito" });
            }
            else
            {
              //alert('Se ha cancelado la edicion');
                $.growl.notice({title:"¡Atención!", message: "Modificación cancelada" });
            }
           $('#tabla').fadeIn(100);
           $('#formulario').fadeOut(100);      
       });
       
       //  Este es el script para cargar las clinicas en el formulario
       function cargarClinicaCrear() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_clinica.php',
               //url: 'http://localhost/practica-ajax-datatables/app/php/listar_clinica.php',
               //url: 'http://localhost/html/practica-ajax-datatables/app/php/listar_clinica.php',

               error: function(xhr, status, error) {


               },
               success: function(data) {
                   $('#clinicasNuevas').empty();
                   $.each(data, function() {
                       $('#clinicasNuevas').append(
                           $('<option ></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });

               },
               complete: {

               }
           });
       };
       cargarClinicaCrear();
       // Este script envia los datos al php para crear el doctor
       $('#enviarDoc').click(function(e) {
           e.preventDefault();
           var nombreNuevo = $('#nombreNuevo').val();
           var numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
           var clinicasNuevas = $('#clinicasNuevas').val();
           var confirmacion = confirm('Se va a crear al doctor '+nombreNuevo+' ¿Estas seguro?')
           if (confirmacion == true)
           {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/crear_doctor.php',
               //url: 'http://localhost/practica_dwec/app/php/crear_doctor.php',
               //url: 'http://localhost/html/practica-ajax-datatables/app/php/crear_doctor.php',
               data: {
                   nombreNuevo: nombreNuevo,
                   numcolegiadoNuevo: numcolegiadoNuevo,
                   clinicasNuevas: clinicasNuevas
               },
               error: function(xhr, status, error) {
                   //$.growl.error({title:"Error", message: error });
               },
               success: function(data) {
                   var $mitabla = $("#miTabla").dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               },
               complete: {
                   
               }

           });
               $.growl.notice({title:"¡Atención!", message: "Doctor creado con éxito" });
           //alert ('Se ha creado el doctor '+nombreNuevo+' con exito.');
          }
          else
          {
              $.growl.notice({title:"¡Atención!", message: "Creación de doctor cancelada" });
              //alert ('No se ha agregado al doctor.');
          }  
          $('#tabla').fadeIn(100);
          $('#formularioCrear').fadeOut(100);
       });

   });

   /* En http://www.datatables.net/reference/option/ hemos encontrado la ayuda necesaria
   para utilizar el API de datatables para el render de los botones */
   /* Para renderizar los botones según bootstrap, la url es esta: 
   http://getbootstrap.com/css/#buttons
   */
