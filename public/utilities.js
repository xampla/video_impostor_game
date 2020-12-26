particlesJS('particles-js',

  {
    "particles": {
      "number": {
        "value": 120,
        "density": {
          "enable": true,
          "value_area": 500
        }
      },
      "color": {
        "value": "#e3e3e3"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#4bc9ef",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#ffffff",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }
);

function showModal() {
  $("#modal").removeClass("off");
}

function hideModal() {
  $("#modal").addClass("off");
}


var numPlayers = 5;
function addPlayer() {
  if(numPlayers<10){
    numPlayers = numPlayers+1;
    var new_email = '<label id="label_'+numPlayers+'" htmlFor="email" class="label">Player '+numPlayers+' </label><input id="email_'+numPlayers+'" name="email_'+numPlayers+'" type="email" class="emailInput" required></input>';
    var current_mail = '#email_'+parseInt(numPlayers-1);
    $(new_email).insertAfter(current_mail);
  }
}


function deletePlayer() {
  if(numPlayers>5){
    $('#email_'+numPlayers).remove();
    $('#label_'+numPlayers).remove();
    numPlayers = numPlayers-1;
  }
}

$("#playersForm").submit(function( event ) {
  event.preventDefault();
  const formData = new FormData(event.target);
  var data = {};
  formData.forEach((value, key) => data[key] = value);
  var json = JSON.stringify(data);

  var sendEmail = $.post('/', {email: json});

  sendEmail.done(function( data ) {
    $('.emailInput').val("");
    alert("Correos enviados. ¡Disfrutad de la partida!");
  });
});
