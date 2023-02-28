var https = require ('https')

var heroId = {
  "Anna": "1",
  "bastion": "2",
  "diva": "3",
  "genji": "4",
  "hanzo": "5",
  "junkrat": "6",
  "lúcio": "7",
  "mick ree": "8",
  "mccoury": "8",
  "mccrea": "8",
  "May": "9",
  "me": "9",
  "mercy": "10",
  "mercy's": "10",
  "pharah": "11",
  "reaper": "12",
  "Reinhardt": "13",
  "roadhog": "14",
  "soldier 76": "15",
  "symmetra": "16",
  "torbjörn": "17",
  "tracer": "18",
  "widowmaker": "19",
  "Winston": "20",
  "zarya": "21",
  "zenyatta": "22",
  "sombra": "23",
  "doomhammer": "24"
}
var heroGender = {
  "Anna": "her",
  "bastion": "its",
  "diva": "her",
  "genji": "his",
  "hanzo": "his",
  "junkrat": "his",
  "lúcio": "his",
  "mick ree": "his",
  "mccoury": "his",
  "mccrea": "his",
  "May": "her",
  "me": "her",
  "mercy": "her",
  "mercy's": "her",
  "pharah": "her",
  "reaper": "his",
  "Reinhardt": "his",
  "roadhog": "his",
  "soldier 76": "his",
  "symmetra": "her",
  "torbjörn": "his",
  "tracer": "her",
  "widowmaker": "her",
  "Winston": "his",
  "zarya": "her",
  "zenyatta": "its",
  "sombra": "her",
  "doomhammer": "his"

}
var heroGender2 = {
  "Anna": "she",
  "bastion": "it",
  "diva": "she",
  "genji": "he",
  "hanzo": "he",
  "junkrat": "he",
  "lúcio": "he",
  "mick ree": "he",
  "mccoury": "he",
  "mccrea": "he",
  "May": "she",
  "me": "she",
  "mercy": "she",
  "mercy's": "she",
  "pharah": "she",
  "reaper": "he",
  "Reinhardt": "he",
  "roadhog": "he",
  "soldier 76": "he",
  "symmetra": "she",
  "torbjörn": "he",
  "tracer": "she",
  "widowmaker": "she",
  "Winston": "he",
  "zarya": "she",
  "zenyatta": "it",
  "sombra": "she",
  "doomhammer": "he"

}
var heroOccupation = {
  "Anna": "a bounty hunter",
  "bastion": "a battle automaton",
  "diva": "a former professional gamer turned mech pilot",
  "genji": "an adventurer",
  "hanzo": "a mercenary and assassin",
  "junkrat": "a thief, demolitionist, mercenary, scavenger, and active anarchist",
  "lúcio": "a DJ and freedom fighter",
  "mick ree": "a bounty hunter",
  "mccoury": "a bounty hunter",
  "mccrea": "a bounty hunter",
  "May": "a climatologist and adventurer",
  "me": "a climatologist and adventurer",
  "mercy": "a field medic and natural responder",
  "mercy's": "a field medic and first responder",
  "pharah": "a security chief",
  "reaper": "unknown",
  "Reinhardt": "an adventurer",
  "roadhog": "a former enforcer. He now works as a bodyguard",
  "soldier 76": "a vigilante",
  "symmetra": "an architech",
  "torbjörn": "a weapons designer",
  "tracer": "an adventurer",
  "widowmaker": "an assassin",
  "Winston": "a scientist and adventurer",
  "zarya": "a soldier",
  "zenyatta": "a wandering guru and adventurer",
  "sombra": "a hacker",
  "doomhammer": "he"
}

var lastSearchedHero = "";

exports.handler = (event, context) => {
  if (event.session.application.applicationId !== "amzn1.ask.skill.7a4ba3a4-1035-4067-ab78-02735e7e2751") {
    context.fail("Invalid Application Id");
  }

  switch(event.request.type) {
    case "LaunchRequest":
      context.succeed(
        buildResponse({},
        buildSpeechletResponse("Initializing Overwatch Database. I have records on all current Overwatch characters. Which hero are you searching for? You can ask things like 'tell me about Mercy' or 'what does junkrat do for a living'. You can also say .all options. to hear available categories of information.",
        "Ready to proceed. How can I help?",
        buildCard("Overwatch Database", "Possible Commands: \nHero Information \nMap Information"),
        false)))
    break;

    case "IntentRequest":
      var intent = event.request.intent
      var intentName = event.request.intent.name

      switch(intentName) {
        case "GetHeroInfo":
          var searchHero = intent.slots.Hero.value.toString()
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
    			  response.on('data', (chunk) => { body += chunk })
    			  response.on('end', () => {
    				var parsed = JSON.parse(body)

    				var heroName = parsed.name

            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`Accessing entry for ${heroName}. I can tell you about ${heroGender[searchHero]} real name, age, occupation, base of operations, play difficulty, combat role, health, armor, or shield information. What should I search?`,
            `Are you still there? I can tell you about ${heroName}s health, armor, shield, real name, age, base of operations, difficulty, role, weapons, or abilities.`,
            buildCardSimple(`Title`, "text"),
            false))
            )
            })
          })
        break;

        case "GetHeroRole":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
      		  response.on('data', (chunk) => { body += chunk })
      		  response.on('end', () => {
      			var parsed = JSON.parse(body)

            var heroName = parsed.name
    				var heroRole = parsed.role.name

            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`${heroName} is a ${heroRole} character.`,
            `Are you still there?`,
            buildCardSimple(`Title`, "text"),
            false))
            )
            })
          })
        break;

        case "GetHeroDefense":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
    			  response.on('data', (chunk) => { body += chunk })
    			  response.on('end', () => {
    				var parsed = JSON.parse(body)

    				var heroName = parsed.name
            var heroHealth = parsed.health
            var heroArmor = parsed.armour
            var heroShield = parsed.shield

            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`${heroName} has ${heroHealth} health, ${heroArmor} armor, and ${heroShield} shield`,
            `Are you still there?`,
            buildCardSimple(`Title`, "text"),
            false))
            )
            })
          })
        break;

        case "GetHeroRealName":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
    			  response.on('data', (chunk) => { body += chunk })
    			  response.on('end', () => {
    				var parsed = JSON.parse(body)

    				var heroName = parsed.name
            var heroRealName = parsed.real_name

            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`${heroName}'s real name is ${heroRealName}`,
            `Are you still there?`,
            buildCardSimple(`Title`, "text"),
            false))
            )
            })
          })
        break;

        case "GetHeroAge":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
    			  response.on('data', (chunk) => { body += chunk })
    			  response.on('end', () => {
    				var parsed = JSON.parse(body)

    				var heroName = parsed.name
            var heroAge = parsed.age

            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`${heroName} is ${heroAge} years old.`,
            `Are you still there?`,
            buildCardSimple(`Title`, "text"),
            false))
            )
            })
          })
        break;

        case "GetHeroBase":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]

          if (searchId == "2" || searchId == "15") {
            context.succeed(
            buildResponse({},
            buildSpeechletResponse(`Base of Operations information for both Bastion and Soldier 76 is currently unknown.`,
            `What else can I help with?`,
            buildCardSimple(`Title`, "text"),
            false))
            )
          } else {
              var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
              var body = ""
              https.get(endpoint, (response) => {
        			  response.on('data', (chunk) => { body += chunk })
        			  response.on('end', () => {
        				var parsed = JSON.parse(body)

        				var heroName = parsed.name
                var heroBase = parsed.base_of_operations

                context.succeed(
                buildResponse({},
                buildSpeechletResponse(`${heroName} works out of a base in ${heroBase}.`,
                `Are you still there?`,
                buildCardSimple(`Title`, "text"),
                false))
                )
                })
              })
            }
        break;

        case "GetHeroDifficulty":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero
          var searchId = heroId[searchHero]
          var endpoint = `https://overwatch-api.net/api/v1/hero/${searchId}`
          var body = ""
          https.get(endpoint, (response) => {
    			  response.on('data', (chunk) => { body += chunk })
    			  response.on('end', () => {
    				var parsed = JSON.parse(body)

    				var heroName = parsed.name
            var parsedDifficulty = parsed.difficulty

            if (parsedDifficulty == 1) {
              context.succeed(
              buildResponse({},
              buildSpeechletResponse(`${heroName} is good for beginners.`,
              `Are you still there?`,
              buildCardSimple(`Title`, "text"),
              false))
              )
            } else if (parsedDifficulty == 2) {
              context.succeed(
              buildResponse({},
              buildSpeechletResponse(`${heroName} is moderately difficult to play.`,
              `Are you still there?`,
              buildCardSimple(`Title`, "text"),
              false))
              )
            } else if (parsedDifficulty == 3) {
              context.succeed(
              buildResponse({},
              buildSpeechletResponse(`${heroName} is hard to play, ${heroGender2[searchHero]} is meant for advanced players.`,
              `Are you still there?`,
              buildCardSimple(`Title`, "text"),
              false))
              )
            } else {
              context.succeed(
              buildResponse({},
              buildSpeechletResponse(`I'm sorry. I'm not sure how hard it is to play ${heroName}.`,
              `Are you still there?`,
              buildCardSimple(`Title`, "text"),
              false))
              )
            }
            })
          })
        break;

        case "GetHeroOccupation":
          var searchHero = checkHero(intent.slots.Hero.value)
          lastSearchedHero = searchHero

          context.succeed(
          buildResponse({},
          buildSpeechletResponse(`${heroGender2[searchHero]} is ${heroOccupation[searchHero]}.`,
          `Are you still there?`,
          buildCardSimple(`Title`, "text"),
          false))
          )
        break;

        case "AMAZON.HelpIntent":
          context.succeed(
            buildResponse({},
              buildSpeechletResponseWithoutCard("For each hero, I can tell you about his or her real name, health, armor, shield, age, nationality, role, weapons, or abilities. ",
              "For each hero, I can tell you about his or her real name, health, armor, shield, age, nationality, role, weapons, or abilities. ",
              false)))
        break;

        default:
          context.fail(`Invalid Intent Name: ${intentRequest.intent.name}`)
      }

    break;

    case "SessionEndedRequest":
    break;

    default:
      context.fail(`Invalid Request Type: ${event.request.type}`)
  }
}

//------------------
//Response Functions
//------------------


//----------------
//Helper Functions
//----------------

checkHero = (inputHero) => {
  if (inputHero == undefined) {
    return lastSearchedHero
  } else {
    return inputHero.toString()
  }
}

buildResponse = (sessionAttributes, speechletResponse) => {
  return {
  version: "1.0",
  sessionAttributes: sessionAttributes,
  response: speechletResponse
}}

//SpeechletResponse 1
buildSpeechletResponse = (outputText, repromptText, cardType, shouldEndSession) => {
  return {
  outputSpeech: {
    type: "PlainText",
    text: outputText
  },
  card: cardType,
  reprompt: {
    type: "PlainText",
    text: repromptText
  },
  shouldEndSession: shouldEndSession
}}

//SpeechletResponse 2
buildSpeechletResponseWithoutCard = (outputText, repromptText, shouldEndSession) => {
  return {
  outputSpeech: {
    type: "PlainText",
    text: outputText
  },
  reprompt: {
    type: "PlainText",
    text: repromptText
  },
  shouldEndSession: shouldEndSession
} }

//cardType 1
buildCard = (cardTitle, cardText, smallImageURL, largeImageURL) => {
  return {
  type: "Standard",
  title: cardTitle,
  content: cardText,
  image: {
    smallImage: smallImageURL,
    largeImage: largeImageURL
  }
}}

//cardType 2
buildCardSimple = (cardTitle, cardText) => {
  return {
  type: "Simple",
  title: cardTitle,
  text: cardText
}}