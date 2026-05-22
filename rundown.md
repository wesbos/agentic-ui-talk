I'd love to do a talk on WebMCP (new Google Proposal), generated UI Components, and exposing server capabilities to agents. Does that sound like it would fit?

MCP UI
Generative UI
OpenAI Apps SDK

Agentic Interfaces: Tools, Skills, generative UI and Web MCP

Who is ordering Starbucks with ChatGPT? Will an Agent just make the perfect UI for you? Do we even need websites anymore? This app could have been an API!

We like using AI, but we also like using websites! Do we add AI to our site, or does our site get added to AI? This talk looks at the current landscape of agentic interfaces and the future of UI, websites and browsers.

- How do you use a website
- How do existing websites get connected to an Agent

- Should Agents use the web?

Will your site simply be a utility? Do airlines want an agent booking your flight?

Generative UI

Travel Agent

Are websites dead? Is chat the final UI?

Other people saying that LLMs will simply jsut generate realtime video of the UI.

Should your site be added to an AI agent, or should an AI agent be added to your site?

Does anyone want to order Starbucks with ChatGPT?

How can we expose existing sites to agents?
How do you fight abuse?

Does every site now need an MCP Server?

I want to mix n match. - Web MCP

## Introduction

"UI Is dead"
"Chatbox is the final interface"
"just give me a skill bro"
"Generative UI is the future"
"AI will soon stream only video as a UI"

Do we even need an user interfaces any more?
Well, no. But the way we interact with services is certainly changing.

## Let's look at some cases

- In some cases, I don't want a UI at all

Example: I switched from Handbrake to ffmpeg because typing "make this video into a 1080p mp4" is easier than checkbox mess.

- In some cases I want to use my voice [unsure of this point]

- in some cases I like to use your UI, but I also hate how much shit work it makes me do. I want a bit more control
  "freshbooks - Categorize all the expenses from Starlink and Bell as communication expesnses. Make sure to log that price as including HST."

- In some cases, I want the UI in my AI
  - ChatGPT Groceries?
  - Starbucks

- In some cases I want a UI tailored to my needs

everyone is vibe coding their own better UI that meets their exact use case of the software

- In some cases I want my apps to kiss
  - Explosion of skills
  - MCP tool calls
  - This is such a huge use right now

Example: I have meeting notes in Notion, 2 gmail accounts emails, tickets in linear and app telementry in Sentry.

## So we have all these different use cases right now.

So, how do we as developers Implement these interfaces? Let's take a look at the options right now.

1. Controlled / Static UI

- Here is a tool call. Instead of returning raw data, it will also return the UI.
- This is what MCP UI (now MCP Apps ) is
-

2. Declarative UI

- You have a whole bag of possible components. You let the Agent figure out which ones to use. They can be returned as JSON descriptors and then rendered on the page. Composing everything.

- JSON ect

This method returns JSON which you can then reconcile against components. Implement in Web, Native, whatever.

3. Fully Generative UI - Let the AI just generate it all. Give it a place to run code.

While AI is pretty good at describing the components it wants, you know what else it's really good at? WRITING CODE.

Give the agent all the possible things it can do. Tools it can call, but don't limit it.

We're seeing this with "Code Mode" right now. Instead of only giving the agent possible tools to run, what if we also gave it a spot where it could just run any code?

GenUI is similar to this. We can give it tools, component and context and guideance, but let it rip!

This obviousl has security issues- we will talk about that in a second.

Aside - this isn't just about Chat. THB the current interfaces suck.

- Show adding 5 limes
- Show the Starbucks Example

[Adaptive Interfaces] Components inside a chat is one use case, but let's think differently.

- Home Assistant. I don't want to have to spend my entire day making a UI
- Given the context that you know about me and my home:

- 1 of my cameras detected motion 5 times
- the humidity spiked last night
- I usually check the weather at 8am [user + time cues]
- There are no calendar events today

Why does my tiktok algorithm know that I like to watch rope swing fails on Friday nights, but I need to spend hours of my life categorizing the 67 light bulbs and switchines in my house?

Take this all and whip up a dashboard for me.

Gen UI can be additive
[show example where three expenses can be grouped]

4. WebMCP

Now we're all here sitting around, talking about generative UI when in reality most of us are doing two things:

1. We're using existing apps and websites
2. we're running an agent like Claude, Codex, Pi etc.. loaded up with skills that can do things on our behalf.

And which one of those we choose to do sort of happens early. If you want an agent to use a site that doesn't expose an API, a skill or MCP server, you reach for a browser that scrapes, DOM parsing + screen shots. This is expensive and DOG is SLOW

This is where Web MCP comes in. Its currently just a spec and early dayts, but it works like this:

You expose your existing website functionality. Uses the existing semantics of the web. Declarative HTML API and imperative JS API.

Just open a tab, and have the agent interface with it.

[show my demo of grocery inputs]

This is really what I want. sometimes a click, sometimes a prompt.

A little this and that. Have the Agent do the first pass. jump in with clicks where it matters.

## My thoughts

Security is an issue

- Web MCP cross-tabs?
- Balance of low power "Oh you can't use web APIs" and full control is a constant battle.
  - I don't want a watered down experience. We learned this with open claw.
- Abuse. We are working so hard to fight bots and spam. but we're also just giving them the keys?
- Brand consistenency and UX
- Designers know better in many causes

Lego blocks of components alone don't make a good experience.

Restrictive + limited options lead to crappy UIs
Full blown vibe coding UIs are also crappy

<!-- Can an LLM make a better UI?
Can I make a better UI for my bank?
Others are saying that the UI will be totally generative. -->

All while I'm wondering things like will the airline simply want to be distilled down into a utility? Have you tried to book a flight recently? Seat selection upsells, scare-tactics for insurance and re-booking fees. As a user I want these things, but I doubt businesses will totally buy in. [maybe put this at the end. Mention the API wars]

## The Ideas

https://x.com/ataiiam/status/2057810576814768425

from controlled (determined by dev at build-time)

to declarative, composing UIs from building blocks (A2UI, JSON Render)

to fully open GenUI (MCP apps/HTML)

bi-directional communicaiton

Declaritive -

- second
- third

Right now: Speed, Consistency. A balance between consistency and dynamic UI

## Use cases

Data visualization

## Security

Sandbox
Remote Dom

## The Tech

https://a2ui.org/#landscape-architect-demo
https://modelcontextprotocol.io/docs/learn/server-concepts#resources
MCP Apps
https://web-ai-sdk.dev/
https://www.youtube.com/watch?v=-NseRIVgoFU
https://json-render.dev/
https://x.com/samjulien/status/2057852854875144605
https://docs.ag-ui.com/introduction
https://developers.googleblog.com/a2ui-v0-9-generative-ui/
https://github.com/standardagents/arrow-js

## Tools

Postman

## Examples

Starbucks Order is slow

Why are we just using TUIs

Rep fitness rack customizer

## ending thoughts

components are key
