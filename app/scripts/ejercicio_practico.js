   'use strict';
   $(document).ready(function() {
       var miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'php/cargar_doctores.php',
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
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://www.aalvarez.infenlaces.com/Juanda/datatables2/php/modificar_doctores.php?id_doctor=' + data + '>Editar</a>';
               }
           }, {
               'data': 'nombre',
               'render': function(data) {
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
       function cargarClinicas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_clinica.php',
               error: function(xhr, status, error) {},
               success: function(data) {
                   $('#id').empty();
                   $.each(data, function() {
                       $('#clinicas').append(
                           $('<option></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });
               },
               complete: {}
           });
       };
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

          var str =  aData.idClinicas;
          var res = str.split(",");

          $('#clinicas').val(res);

       });
       cargarClinicas();
       $('#creaDoc').click(function(e) {
           e.preventDefault();
           
           $('#tabla').fadeOut(100);
           $('#formularioCrear').fadeIn(100);
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
               type: 'POST',
               dataType: 'json',
               url: 'php/borrar_doctor.php',
               data: {
                   id_doctor: idDoctor
               },
               error: function(xhr, status, error) {
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
               }
           });
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
                data: {
                  idDoctor: idDoctor,
                  nombre: nombre,
                  numcolegiado: numcolegiado,
                  id_clinica:id_clinica                
                },
                error: function(xhr, status, error) {
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
                }
                });
               $.growl.notice({title:"¡Atención!", message: "Doctor modificado con éxito" });
            }
            else
            {
                $.growl.notice({title:"¡Atención!", message: "Modificación cancelada" });
            }
           $('#tabla').fadeIn(100);
           $('#formulario').fadeOut(100);      
       });
              function cargarClinicaCrear() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_clinica.php',

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
       $('#enviarDoc').click(function(e) {
           e.preventDefault();
           
           if(!$("#formCrear").valid()){
               alert("Por favor rellene los campos correctamente. Nombre: Obligatorio y sin números; Número de colegiado: Debe ser numérico; Debe seleccionar al menos una clínica.");
               return;
           }
           
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
               data: {
                   nombreNuevo: nombreNuevo,
                   numcolegiadoNuevo: numcolegiadoNuevo,
                   clinicasNuevas: clinicasNuevas
               },
               error: function(xhr, status, error) {
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
          }
          else
          {
              $.growl.notice({title:"¡Atención!", message: "Creación de doctor cancelada" });
          }  
          $('#tabla').fadeIn(100);
          $('#formularioCrear').fadeOut(100);
       });
       
       jQuery.validator.setDefaults({
           debug: true,
           success: "valid"
       });

       $("#formCrear").validate({
           rules: {
               nombreNuevo: {
                   required: true,
                   lettersonly: true
               },
               numcolegiadoNuevo: {
                   digits: true
               },
               clinicasNuevas: {
                   required: true
               }
           },
           messages: {
               nombreNuevo: {
                   required: "Este campo es obligatorio.",
                   lettersonly: "El nombre debe contener solo letras"
               },
               numcolegiadoNuevo:{
                   digits: "Debe introducir solo dígitos."
               },
               clinicasNuevas: {
                   required: "Debe seleccionar al menos una clínica."
               }
           }
       });

   });
