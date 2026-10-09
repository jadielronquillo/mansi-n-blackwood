
$(function () {

    // Respetar la preferencia de movimiento reducido.
    $.fx.off = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Guardar las habitaciones únicas visitadas.
    const habitacionesVisitadas = new Set();

    // Guardar las pistas encontradas.
    const pistas = {
        biblioteca: "Diario: la respuesta está detrás del espejo.",
        laboratorio: "Nota: el profesor intentó hablar con los muertos.",
        espejo: "Inscripción: la verdad tiene un precio.",
        sotano: "Documento antiguo: la última respuesta está detrás del espejo."
    };

    // Preparar el modal final.
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalFinal")
    );

    // Desplazar la página hasta una sección.
    function irA(selector) {
        $("html, body").stop(true).animate({
            scrollTop: Math.max(0, $(selector).offset().top - 75)
        }, 700);
    }

    // Mostrar la historia y la calabaza.
    $("#btnEntrar").on("click", function () {
        $(this).prop("disabled", true);

        $("#calabaza").fadeIn(1000);

        $("#textoHistoria").fadeIn(1200, function () {
            irA("#historia");
        });
    });

    // Continuar la historia.
    $("#continuarHistoria").on("click", function () {
        $(this).prop("disabled", true);

        $("#mensajeOscuro").fadeIn(500);

        $("#habitaciones").slideDown(1000, function () {
            irA("#habitaciones");
        });

        $("#fantasma")
            .stop(true, true)
            .css("left", "-150px")
            .animate({ left: "110%" }, 3000);
    });

    // Explorar las habitaciones y registrar visitas únicas.
    $(".explorar").on("click", function () {
        const boton = $(this);
        const nombre = boton.data("habitacion");
        const pista = $("#" + nombre);
        const estabaVisible = pista.is(":visible");

        // Registrar la habitación solamente una vez.
        if (!estabaVisible) {
            habitacionesVisitadas.add(nombre);
        }

        // Mostrar u ocultar la pista.
        if (estabaVisible) {
            pista.stop(true, true).slideUp(400);
            boton.attr("aria-expanded", "false");
        } else {
            pista.stop(true, true).slideDown(400);
            boton.attr("aria-expanded", "true");
        }

        // Actualizar el contador de cuatro habitaciones.
        $("#progreso").text(
            "Habitaciones visitadas: " +
            habitacionesVisitadas.size + " de 4"
        );

        // Desbloquear la puerta después de visitar las cuatro.
        if (habitacionesVisitadas.size === 4) {
            $("#abrirPuerta").prop("disabled", false);
            $("#abrirPuerta").text("Mover el espejo 🚪");

            $("#avisoPuerta").text(
                "¡Has encontrado todas las pistas! La puerta está desbloqueada."
            );
        }
    });

    // Cambiar el tamaño de los iconos al pasar el ratón.
    $(".habitacion")
        .on("mouseenter", function () {
            $(this).find(".icono")
                .stop(true)
                .animate({ fontSize: "90px" }, 250);
        })
        .on("mouseleave", function () {
            $(this).find(".icono")
                .stop(true)
                .animate({ fontSize: "70px" }, 250);
        });

    // Encender y apagar las luces.
    $("#btnLuces").on("click", function () {
        $("body").toggleClass("luces-apagadas");

        if ($("body").hasClass("luces-apagadas")) {
            $(this).text("Encender luces 💡");
        } else {
            $(this).text("Apagar luces 💡");
        }
    });

    // Abrir la puerta solamente si visitó las cuatro habitaciones.
    $("#abrirPuerta").on("click", function () {
        if (habitacionesVisitadas.size !== 4) {
            return;
        }

        $(this).prop("disabled", true);

        $("#habitaciones").fadeOut(700, function () {
            $("#secreto").fadeIn(1000, function () {
                irA("#secreto");
            });
        });
    });

    // Mostrar el final y las pistas encontradas.
    function mostrarFinal(decision) {
        $("#listaPistas").empty();

        habitacionesVisitadas.forEach(function (habitacion) {
            $("#listaPistas").append(
                $("<li>").text(pistas[habitacion])
            );
        });

        if (decision === "verdad") {
            $("#iconoFinal").text("👻");
            $("#nombreFinal").text("La verdad de Blackwood");

            $("#textoFinal").text(
                "Blackwood nunca abandonó la mansión. " +
                "Su experimento logró comunicarlo con el mundo de los vivos. " +
                "Ahora conoces su secreto, pero una sombra aparece detrás de ti..."
            );
        } else {
            $("#iconoFinal").text("🏃");
            $("#nombreFinal").text("Escapaste de la mansión");

            $("#textoFinal").text(
                "Decides abandonar la mansión sin descubrir toda la verdad. " +
                "Logras escapar, pero la imagen de Blackwood te sigue " +
                "atormentando en tus sueños."
            );
        }

        modal.show();
    }

    // Final 1: conocer la verdad.
    $("#btnVerdad").on("click", function () {
        mostrarFinal("verdad");
    });

    // Final 2: escapar de la mansión.
    $("#btnHuir").on("click", function () {
        mostrarFinal("huir");
    });

    // Reiniciar la aventura.
    $("#reiniciar").on("click", function () {
        window.location.reload();
    });

});