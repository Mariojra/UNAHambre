/**Controlador para cuando ya se ha realizado el pago 
 * verifica el id pedido en el session storage 
 * modificara el estado del pedido en la base y agregara la transacción al historial si el pago se hizo con tarjeta
 * eliminara el id pedido del session storage
 */

document.addEventListener("DOMContentLoaded", () => {
    //configuracion sweetalert
    const alert_default = Swal.mixin({
        closeOnClickOutside: false,
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (modal) => {
            modal.addEventListener('mouseenter', Swal.stopTimer)
            modal.addEventListener('mouseleave', Swal.resumeTimer)
            // modal.addEventListener('onclick', location.replace('principal.html'))
        },
        showClass: {
            popup: 'animated fadeInDown'
        },
        hideClass: {
            popup: 'animated fadeOutUp'
        }
    });


    if (sessionStorage.getItem('idPedido') != undefined) {
        /**Actualizar el estado del pedido */
        axios({
            method: 'POST',
            url: 'https://api-unahambre.herokuapp.com/api_pago/verificar_pago',
            data: {
                "idPedido": sessionStorage.getItem('idPedido'),
                "estadoPago": false
            },
            headers: {
                "access-token": sessionStorage.getItem('token')
            }

        }).then(async res => {
            document.getElementById('cancel_procesando').style.display = 'none'
            sessionStorage.removeItem('idPedido')
           
                await alert_default.fire({
                    icon: 'success',
                    title: 'Pedido cancelado exitosamente..'
                });
                location.replace('principal.html')
 
        }).catch(err => {
            alert('No se ha podido realizar el pedido, intentalo más tarde...')
            console.log(err)
        })
    } else {
        location.replace('principal.html')
    }
})