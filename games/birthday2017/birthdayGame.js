"use strict";
/* global alert */

window.winningScore = 7;

(function() {

  let exports = {};
  window.birthday = exports;
  
  let currentPhase = 0;

  exports.nextPhase = function() {
    currentPhase++;
    exports.moveToPhase(currentPhase);
  };
  
  exports.moveToPhase = function(phaseNumber) {
    currentPhase = phaseNumber;
    var nextPhaseClassName = "phase" + phaseNumber;
      console.log("Moving to phase: ", nextPhaseClassName);
    $(".phase").fadeOut("slow").promise().done(function() {
      console.log("fade out complete all .phase");
      
      $("." + nextPhaseClassName).fadeIn(500, function() {
        console.log("fade in complete: ", nextPhaseClassName);
      });
      
    });
  };
  
  exports.checkPhaseAnswer = function(inputSelector, correctAnswer, wrongMessage) {
    var input = $(inputSelector).val();
    console.log("checkPhaseAnswer - input: ", input, " answer: ", correctAnswer);
    if (input == correctAnswer) {
      exports.nextPhase();
    } else {
      
      var msg = wrongMessage || "Nopers!!!!!";
      alert(msg);
    }
  };
  
  return exports;

} (window));
