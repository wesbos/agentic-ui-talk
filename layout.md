# Agentic Interfaces: Tools, Skills, generative UI and Web MCP

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

### 1. Controlled / Static UI

- Here is a tool call. Instead of returning raw data, it will also return the UI.
- This is what MCP UI (now MCP Apps ) is
-

### 2. Declarative UI

- You have a whole bag of possible components. You let the Agent figure out which ones to use. They can be returned as JSON descriptors and then rendered on the page. Composing everything.

This method often returns a JSON SPEC that describes the UI you want. You then reconcile against components. Implement in Web, Native, whatever.

[Show a few examples]

### 3. Fully Generative UI - Let the AI just generate it all. Give it a place to run code.

While AI is pretty good at describing the components it wants, you know what else it's really good at? WRITING CODE.

Give the agent all the possible things it can do. Tools it can call, but don't limit it.

We're seeing this with "Code Mode" right now. Instead of only giving the agent possible tools to run, what if we also gave it a spot where it could just run any code?

GenUI is similar to this. We can give it tools, component and context and guideance, but let it rip!

This obviousl has security issues- we will talk about that in a second.

### THis isn't just about chat

Aside - this isn't just about Chat. The the current interfaces suck.

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

## Gen UI can be additive

[show example where three expenses can be grouped]
Maybe skip this

### 4. WebMCP

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

## Security

Security is an issue
MCP Apps use a sandbox - iframed
ArrowJS uses a sandbox
https://github.com/Shopify/remote-dom

Web MCP uses the browser's security model. The only implementation right now is from Google, but I don't see why we couldn't have somthing that crosses those tabs.

## My thoughts

- Lego blocks of components alone don't make a good experience. While much of good UX can be systematized intro rules, examples and suggestions.
- Designers know better in many causes

- Speed and consistency are a huge thought
- Balance of low power "Oh you can't use web APIs" and full control is a constant battle.
  - I don't want a watered down experience. We learned this with open claw.
- Abuse. We are working so hard to fight bots and spam. but we're also just giving them the keys?
- Brand consistenency and UX
- Power Battle. I'm wondering things like will the airline simply want to be distilled down into a utility? Have you tried to book a flight recently? Seat selection upsells, scare-tactics for insurance and re-booking fees. As a user I want these things, but I doubt businesses will totally buy in. [maybe put this at the end. Mention the API wars]

- Can the LLM make a 100% better UI? Maybe. Can the avg user? I don't think so. I think generative UI will be about customizing experiences, smart defaults, suggestive UI, contextual components.

Agentic Gen'd UI will save us from crappy UIs.

- Help us get our work done fast and accurately
- create delightful UIs
