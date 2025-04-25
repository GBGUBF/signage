import { getLayout, presentMaterial } from './layout/gridUtilities.js';

let intervalID;

let loaded = {};

const setupDisplay = (items) => {
    let gridTemplateConfiguration = getLayout(items)

    let parent = $(".parent")
  
    $(parent).css('grid-template-columns', gridTemplateConfiguration.gridTemplateColumns)
    $(parent).css('grid-template-rows', gridTemplateConfiguration.gridTemplateRows)
    $(parent).css('grid-template-areas', gridTemplateConfiguration.layout)

    presentMaterial(items)

    intervalID = setInterval(
      function() {
        for ( let [iframeName, loadState] of Object.entries(loaded) ) {
          if (!loadState) {
            let iframe = document.getElementById(iframeName)

            iframe.src = iframe.src
          }
        }

        if (Object.values(loaded).every(v => v === true) ) {
          clearInterval(intervalID)
        }
            
      }, 1000
    )
}

let queryString = window.location.search

const params = new URLSearchParams(queryString);

let entries;
let inputs;
let mc;

let wakeLock;

let config;

if (params.size > 0) {
  entries = params.entries();
  inputs = JSON.parse(Object.fromEntries(params.entries()).data).signageConfiguration.items
  setupDisplay(inputs);
}

navigator.managed.getManagedConfiguration(['signageConfiguration']).then(function (result) {
  config = result["signageConfiguration"];

  let items = config.items;
  
  setupDisplay(items);
}).then(function() {
  
}).catch(e => {
  console.log(e);
});

document.addEventListener("DOMContentLoaded", async (event) => {
  wakeLock = await navigator.wakeLock.request("screen");

  setInterval(
    function() {
      Array.prototype.slice.call(document.getElementsByTagName("iframe")).forEach(
        iframe => { iframe.src = iframe.src }
      )
    },
    600000
  )
});
