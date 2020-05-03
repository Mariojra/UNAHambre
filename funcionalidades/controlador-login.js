/* conf de sweet alert pequeño */
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    width:'40rem',
    customClass:{
        popup:'swal-toastCustomPopup',
        title:'swal-toastCustomTitle'
    },
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

/* conf de sweet alert predeterminados */
const alert_defaults = Swal.mixin({
    timer: 3000,
    timerProgressBar: true,
    onOpen: (modal)=>{
        modal.addEventListener('mouseenter', Swal.stopTimer)
        modal.addEventListener('mouseleave', Swal.resumeTimer)
    },
    customClass:{
        popup:'swal-customPopup',
        title:'swal-customTitle',
        icon: 'swal-customIcon',
        confirmButton: 'swal-customButton'
    },
    showClass: {
        popup: 'animated zoomInDown'
      },
      hideClass: {
        popup: 'animated zoomOutUp'
      }
});

$("#btn-login").click( () => {
    if(validarCampoVacio("#txt-usuario"),
        validarCampoVacio("#txt-pass")){
        // console.log("estas en el link y validando");
         let datos = {
             usuario:$("#txt-usuario").val(),
             contrasena:$("#txt-pass").val()
         };

        // console.log(datos);
        axios({
            method: 'POST',
            url: 'https://api-unahambre.herokuapp.com/api_login',
            data: datos
        }).then(res=>{
            console.log(res);
            if(res.data.item!=null){
                Toast.fire({
                   icon: 'success',
                   title: 'Inicio exitoso'+ ' '+ res.data.items[2][0].usuario
                })
                sessionStorage.setItem('token',res.data.item);
                sessionStorage.setItem('userID',res.data.items[1][0].id);
                sessionStorage.setItem('userName',res.data.items[2][0].usuario);
                sessionStorage.setItem('rol',res.data.items[4][0].Rol);
                sessionStorage.setItem('userProfile', res.data.items[5][0].foto)
                // location.replace("principal.html");
                switch(sessionStorage.getItem('rol')){
                    case '0':
                        //administrador
                        //direccionamiento a la pagina de admon
                        // location.replace("admin.html"); cambiar a disposicion de pagina
                        location.replace("administracion-usuario.html");
                        break;
                    case '1':
                        //dueño de local
                        //siempre redirige a principal?
                        location.replace("administracion-negocio.html");
                        break;
                    case '2':
                        //cliente comun
                        location.replace("principal.html");                    

                        break;
                    default:
                        console.log(sessionStorage.getItem('rol'));
                        console.log("ocurrio un error, revisar la variable de sesion");
                        break;
                }
                
            } else {
                alert_defaults.fire({
                    icon:"error",
                    title: res.data.error
                });
            }
        }).catch(err=>{
            console.log(err);
        })
    }
});

//FUNCIONALIDAD OJO MOSTRAR PASSWORD
let mostrarC = 0;

$("#btn-login-ojo").click(function () {
    if (mostrarC==0) {
        $("#ojo").removeClass('fa-eye');
        $("#ojo").addClass('fa-eye-slash');
        $("#txt-pass").attr('type','text');
        $("#txt-pass").focus();
        mostrarC=1;
    } else {
        $("#ojo").removeClass('fa-eye-slash');
        $("#ojo").addClass('fa-eye');
        $("#txt-pass").attr('type','password');
        $("#txt-pass").focus();
        mostrarC=0;
    }
})

//FUNCION DE VALIDACION DE CAMPO VACIO
function validarCampoVacio(id){
    if ($(id).val()==""){
        // $(id).addClass("is-invalid");
        // $(id).removeClass("is-valid");
        alert_defaults.fire({
            icon: "error",
            title: "No se permiten campos vacios"
        });
        return false;
    } else {
        // $(id).addClass("is-valid");
        // $(id).removeClass("is-invalid");
        return true;
    }
}