/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk-core");

const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name ===
          "GetRemoteDataIntent")
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";

    await getRemoteData("http://api.open-notify.org/astros.json")
      .then(response => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${
          data.people.length
        } astronauts in space. `;
        for (let i = 0; i < data.people.length; i++) {
          if (i === 0) {
            //first record
            outputSpeech =
              outputSpeech + "Their names are: " + data.people[i].name + ", ";
          } else if (i === data.people.length - 1) {
            //last record
            outputSpeech = outputSpeech + "and " + data.people[i].name + ".";
          } else {
            //middle record(s)
            outputSpeech = outputSpeech + data.people[i].name + ", ";
          }
        }
      })
      .catch(err => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder.speak(outputSpeech).getResponse();
  }
};

function getUrlFromName(name) {
  // Cha Dev
  if (isChadev(name)) {
    return "chadevs";
  }

  // CodeXX
  if (isCodeXX(name)) {
    return "codexx";
  }

  // Hack Night
  if (isHackNight(name)) {
    return "Carbon-Five-Chattanooga-Hack-Nights";
  }

  // Art Dev
  if (isArtDev(name)) {
    return "CHA-Art-Dev";
  }

  // UX Design
  if (isUxDesign(name)) {
    return "Chattanooga-UX-Design-Meetup";
  }

  // Cha Devops
  if (isChaDevops(name)) {
    return "chadevops";
  }

  return "";
}

function isChadev(name) {
  return false;
}

function isCodeXX(name) {
  const matchCode = name.match(/code/);
  if (matchCode.length > 0) {
    return true;
  }

  return false;
}

function isHackNight(name) {
  const matchHack = name.match(/hack/);
  if (matchHack.length > 0) {
    return true;
  }
  const matchNight = name.match(/night/);
  if (matchNight.length > 0) {
    return true;
  }
  const matchCarbon = name.match(/carbon/);
  if (matchCarbon.length > 0) {
    return true;
  }

  return false;
}

function isArtDev(name) {
  const matchArt = name.match(/art/);
  if (matchArt.length > 0) {
    return true;
  }

  return false;
}

function isUxDesign(name) {
  const matchUX = name.match(/ux/);
  if (matchUX.length > 0) {
    return true;
  }
  const matchDesign = name.match(/design/);
  if (matchDesign.length > 0) {
    return true;
  }

  return false;
}

function isChaDevops(name) {
  const matchOps = name.match(/ops/);
  if (matchOps.length > 0) {
    return true;
  }

  return false;
}

const NextMeetupHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "NextMeetupIntent"
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "You are in the Next Meet Up Handler";
    const name =
      handlerInput.requestEnvelope.request.intent.slots.meetupName.value;

    const urlName = getUrlFromName(name);

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .withSimpleCard("Chattanooga Techie", urlName)
      .getResponse();

    // await getRemoteData(`https://api.meetup.com/${urlName}/events`)
    //   .then(response => {
    //     const data = JSON.parse(response);
    //     outputSpeech = "I got you some data";
    //
    //     if (data.length > 0) {
    //       const meetupData = data[0];
    //       const date = meetupData.local_date;
    //       const where = meetupData.venue.name;
    //       const eventName = meetupData.name;
    //       const time = meetupData.local_time;
    //       const meetupName = meetupData.group.name;
    //       outputSpeech = `The next ${meetupName} is ${date} at ${time}. It will happen at ${where}. The name of this event is ${eventName}`;
    //     } else {
    //       outputSpeech = `There are currently no upcoming ${name} meetup.`;
    //     }
    //   })
    //   .catch(err => {
    //     //set an optional error message here
    //     //outputSpeech = err.message;
    //     outputSpeech = `There is no meetup called ${name}. Please try again.`;
    //   });
    //
    // return handlerInput.responseBuilder
    //   .speak(outputSpeech)
    //   .withSimpleCard("Chattanooga Techie", outputSpeech)
    //   .getResponse();
  }
};

const IntroHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText =
      "Welcome to Chattanooga Techie. To find out when the next meet up is say, Alexa ask Chattanooga Techie when is the next Cha Dev meetup. Where Cha Dev is the Chattanooga tech meet up you are interested in.";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "You can introduce yourself by telling me your name";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "Goodbye!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const getRemoteData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    NextMeetupHandler,
    IntroHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
