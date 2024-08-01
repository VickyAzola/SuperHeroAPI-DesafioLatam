$(document).ready(function() {

  //evento submit para desencadenar la busqueda de data
  $("form").on("submit", function(e) {
    e.preventDefault();
    //id corresponde al valor ingresado por el usuario
    let id = parseInt($("#numero").val())
    
    //usa la funcion para validar y entrega mensaje de error si id no es valida
    if (!isValidId(id)) {
      alert("El número debe ser entre 1 y 732");
      return;
    } 
    
    //toma el ajax retornado por la funcion. si el id es valido
    //muestra la carta y el grafico aparece solo si los valores de poder NO son nulos
    getHeroData(id).done(function(response) {
      heroCard(response) //card

      for(const power in response.powerstats) {
        if(response.powerstats[power] !== "null") {
          heroChart(response) //gráfico
        } else {
          $("#heroChart").html("<p>Este héroe no tiene stats de poder</p>")
        }
      }
      
    }).fail(function() {
      //en caso de haber error al soliciar a la API
      alert("Error al obtener los datos del superhéroe")
    });
  });

  //validar número ingresado por el usuairo
  function isValidId(id) {
    let regex = /^\d+$/ //permite solo digitos
    return regex.test(id) && id > 0 && id <= 732 //asegurar que el valor este entre 1 y 732
  }

  //consulta a la API, cambia el número final por el valor ingresado por el usuairo
  function getHeroData(id) {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://superheroapi.com/api.php/ccb63b0c74859a84b3dde44600ed20da/${id}`,
      "method": "GET",
      "dataType": "json",
      "headers": {
        "Accept": "*/*",
      }
    }

    return $.ajax(settings)
  }
  
  //crea carta con informacion básica
  function heroCard(response) {
    let heroCard = `
      <div class="card mb-3" style="max-width: 50rem;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${response.image.url}" class="img-fluid rounded-start h-100 w-100" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${response.name}</h5>
              <p class="card-text">Conexiones: ${response.connections.relatives}</p>
              <em class="card-text"><small class="text-body-secondary">Publicado por: ${response.biography.publisher}</small></em>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Ocupación: ${response.work.occupation}</li>
              <li class="list-group-item">Primera Aparición: ${response.biography["first-appearance"]}</li>
              <li class="list-group-item">Altura: ${response.appearance.height[1]}</li>
              <li class="list-group-item">Peso: ${response.appearance.weight[1]}</li>
              <li class="list-group-item">Alianzas: ${response.connections["group-affiliation"]}</li>
            </ul>
          </div>
        </div>
      </div>
    `

    $("#heroCard").html(heroCard);
  }
  
  //crea gráfico torta con los poderes
  function heroChart(response) {
    $("#heroChart").CanvasJSChart({
      title: {
        animationEnabled: true,
        text: `Estadísticas de Poder para ${response.name}`,
        fontSize: 28
      },
      data: [
        {
          type: "pie",
          startAngle: 25,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          dataPoints: [
            {y: response.powerstats.intelligence, label: "Inteligencia"},
            {y: response.powerstats.strength, label: "Fuerza"},
            {y: response.powerstats.speed, label: "Velocidad"},
            {y: response.powerstats.durability, label: "Durabilidad"},
            {y: response.powerstats.power, label: "Poder"},
            {y: response.powerstats.combat, label: "Combate"}
          ]
        }
      ]
    });
  }
})
