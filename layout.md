# Agentic Interfaces: Tools, Skills, Generative UI and WebMCP

## Introduction

- "UI is dead"
- "Chat is the final interface"
- "Just give me a skill, bro"
- "Generative UI is the future"
- "AI will soon stream only video as a UI"

Do we even need user interfaces anymore?
Well, no — but the way we interact with services is certainly changing.

## Let's look at some cases

- In some cases, I don't want a UI at all

  Example: I switched from HandBrake to ffmpeg because typing "make this video into a 1080p mp4" is easier than a checkbox mess.

- In some cases, I want to use my voice [NOTE: unsure of this point]

- In some cases, I like to use your UI, but I also hate how much shit work it makes me do. I want a bit more control

  > FreshBooks — Categorize all the expenses from Starlink and Bell as communication expenses. Make sure to log that price as including HST.

- In some cases, I want the UI in my AI
  - ChatGPT Groceries?
  - Starbucks

- In some cases, I want a UI tailored to my needs

  Everyone is vibe coding their own better UI that meets their exact use case of the software.

- In some cases, I want my apps to kiss
  - Explosion of skills
  - MCP tool calls
  - This is such a huge use right now

  Example: I have meeting notes in Notion, email from two Gmail accounts, tickets in Linear, and app telemetry in Sentry.

## So we have all these different use cases right now.

So, how do we as developers implement these interfaces? Let's take a look at the options right now.

### 1. Controlled / Static UI

- Here is a tool call. Instead of returning raw data, it will also return the UI.
- This is what MCP UI (now MCP Apps) is

### 2. Declarative UI

- You have a whole bag of possible components. You let the agent figure out which ones to use. They can be returned as JSON descriptors and then rendered on the page, composing everything.

This method often returns a JSON spec that describes the UI you want. You then reconcile against components. Implement in web, native, whatever.

[NOTE: Show a few examples]

### 3. Fully Generative UI — Let the AI just generate it all. Give it a place to run code.

While AI is pretty good at describing the components it wants, you know what else it's really good at? WRITING CODE.

Give the agent all the possible things it can do. Tools it can call, but don't limit it.

We're seeing this with "Code Mode" right now. Instead of only giving the agent possible tools to run, what if we also gave it a spot where it could just run any code?

GenUI is similar to this. We can give it tools, components, context, and guidance, but let it rip!

This obviously has security issues — we will talk about that in a second.

### This isn't just about chat

Aside — this isn't just about chat. The current interfaces suck.

- Show adding 5 limes
- Show the Starbucks example

[Adaptive Interfaces] Components inside a chat is one use case, but let's think differently.

#### Context-aware dashboard (example)

- Home Assistant. I don't want to have to spend my entire day making a UI
- Given the context that you know about me and my home:
  - 1 of my cameras detected motion 5 times
  - The humidity spiked last night
  - I usually check the weather at 8am [user + time cues]
  - There are no calendar events today

Why does my TikTok algorithm know that I like to watch rope swing fails on Friday nights, but I need to spend hours of my life categorizing the 67 light bulbs and switches in my house?

Take this all and whip up a dashboard for me.

## Gen UI can be additive

[NOTE: Show example where three expenses can be grouped — maybe skip this]

### 4. WebMCP

Now we're all here sitting around, talking about generative UI when in reality most of us are doing two things:

1. We're using existing apps and websites
2. We're running an agent like Claude, Codex, Pi, etc. loaded up with skills that can do things on our behalf.

And which one of those we choose to do sort of happens early. If you want an agent to use a site that doesn't expose an API, a skill, or MCP server, you reach for a browser that scrapes, DOM parsing + screenshots. This is expensive and DOM is SLOW.

This is where WebMCP comes in. It's currently just a spec and early days, but it works like this:

You expose your existing website functionality. It uses the existing semantics of the web — declarative HTML API and imperative JS API.

Just open a tab, and have the agent interface with it.

[NOTE: Show my demo of grocery inputs]

This is really what I want. Sometimes a click, sometimes a prompt.

A little this and that. Have the agent do the first pass. Jump in with clicks where it matters.

## Security

Security is an issue.

- MCP Apps use a sandbox — iframed
- Arrow JS uses a sandbox
- Remote DOM (Shopify): https://github.com/Shopify/remote-dom

WebMCP uses the browser's security model. The only implementation right now is from Google, but I don't see why we couldn't have something that works across tabs.

## My thoughts

- Lego blocks of components alone don't make a good experience. While much of good UX can be systematized into rules, examples, and suggestions, designers know better in many cases.

- Speed and consistency are a huge factor
- Balance of low power "Oh you can't use web APIs" and full control is a constant battle.
  - I don't want a watered down experience. We learned this with OpenClaw.
- Abuse. We are working so hard to fight bots and spam, but we're also just giving them the keys?
- Brand consistency and UX
- Power battle. I'm wondering things like: will the airline simply want to be distilled down into a utility? Have you tried to book a flight recently? Seat selection upsells, scare-tactics for insurance and re-booking fees. As a user I want these things, but I doubt businesses will totally buy in. [NOTE: maybe put this at the end — mention the API wars]

- Can the LLM make a 100% better UI? Maybe. Can the avg user? I don't think so. I think generative UI will be about customizing experiences, smart defaults, suggestive UI, contextual components.

Agentic generated UI will save us from crappy UIs.

- Help us get our work done fast and accurately
- Create delightful UIs
