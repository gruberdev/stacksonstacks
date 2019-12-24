import * as THREE from 'three';
// import WebVRPolyfill from 'webvr-polyfill';
import {SceneManager} from 'scenemanager';
import {isVREnabled, addControls, updateControls} from 'controlmanager';
import {parseDotOutput} from 'terra-parse';
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls:any;
var vrDisplay:any;
var scene:SceneManager|null;
var startbutton = document.getElementById("startButton");
startbutton.addEventListener("click",renderScene);
renderScene();
function renderScene(){
  //dispose of old scene if defined
  if(scene){
    scene.dispose();
  }
  //make all the objects
  var text = (<HTMLInputElement>document.getElementById('textbox')).value;
  var terraform_json:any = parseDotOutput(text);

  scene = new SceneManager(terraform_json);
  var color1picker = document.getElementById("color1");
  color1picker.addEventListener("change", function(event:any){
    var color = event.target.value;
    scene.updateSkyColor(color);
  });
  var color2picker = document.getElementById("color2");
  color2picker.addEventListener("change", function(event:any){
    var color = event.target.value;
    scene.updateGroundColor(color);
  });

  
  var blocker = document.getElementById("blocker");
  addControls(scene, scene.camera, blocker,startbutton).then(
  	function(){
    	if(isVREnabled()){
    		vrDisplay.requestAnimationFrame(vrAnimate);
    	}
    	else{
    		requestAnimationFrame(desktopAnimate);
    	}
    }
  ).catch(function(error){
  	console.log(error);
  });
}


function vrAnimate(){
	updateControls();
  scene.updateScene();
	vrDisplay.requestAnimationFrame(vrAnimate);
  renderer.render( scene, scene.camera );
}

function desktopAnimate(){
  updateControls();
  scene.updateScene();
	requestAnimationFrame(desktopAnimate);
  renderer.render( scene, scene.camera );
}









