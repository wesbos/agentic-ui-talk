# Agentic Interfaces: Tools, Skills, Generative UI and WebMCP

## Introduction

- "UI is dead"
- "Chat is the final interface"
- "Just give me a skill, bro"
- "Generative UI is the future"
- "AI will soon stream only video as a UI"

Do we even need user interfaces anymore?

Well, no — but the way we interact with the web is certainly changing.

## Let's look at some cases

### In some cases, I don't want a UI at all

Example: I switched from HandBrake to ffmpeg because typing "make this video into a 1080p mp4" is easier than a checkbox mess.

Show handbrake screenshot

next slide show claude -p screenshot

### In some cases, I want to use my voice [NOTE: unsure of this point]

Slide: Please make somthing that shows speech bubbles of "Hey google, turn my lights on" and then "Done."

### In some cases, I like to use your UI, but I also hate how much shit work it makes me do. I want a bit more control

> FreshBooks — Categorize all the expenses from Starlink and Bell as communication expenses. Make sure to log that price as including HST.

Include Freshbooks Example.

### In some cases, I want the UI in my AI

- loop car-engine.mp4

### In some cases, I want a UI tailored to my needs

Everyone is vibe coding their own better UI that meets their exact use case of the software.

Slide: Show everything in ss/vibes. Scatter them across the screen.

### - In MANY cases, I want my apps to kiss.

- Explosion of skills
- MCP tool calls
- This is such a huge use right now

Example: I have meeting notes in Notion, email from two Gmail accounts, tickets in Linear, and app telemetry in Sentry.

Slide: Create a diagram that shows a chat window with the icons from all these companies being fed in.

## So we have all these different use cases right now.

So, how do we as developers implement these interfaces? Let's take a look at the options right now.

### 1. Controlled / Static UI

- Here is a tool call. Instead of returning raw data, it will also return the UI.

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

While there are some good use cases

- loop car-engine.mp4

Most of the can interfaces just suck

- Show adding 5 limes
- Show the Starbucks slow example

[Adaptive + Reactive Interfaces] Components inside a chat is one use case, but let's think differently.

#### Context-aware dashboard (example)

Let's look at an example. The smart home.

No UI - In some cases I don't want a UI. My lights should just turn on when it thinks it should.

Voice UI - in some cases I just want to yell at my smart speaker.

Custom UI - in some cases, I want to see things. This is my home assistant dashboard - home-assistant.png.

- Home Assistant. I don't want to have to spend my entire day making a UI.

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

I like to call this "Clicks n' Clankers"

A little this and that. Have the agent do the first pass. Jump in with clicks where it matters.

Show a demo of a chat UI Controlling two apps, in two tabs

## Why I think this is the UI

note: The may be moved earlier.

These generative UIs are great. We started with static components, then moved to dynamic components. Soon the components will update without regenerating a new component each time.

Once we get, that components start to feel a bit cramped, so we get full screen components.

So what will we do? Add tabs? It's hard to share the thing I'm working on. URLS!

You're rebuilding the browser!

#### WebMCP API

Declarative - with HTML

```html
<form
  toolname="add_item"
  tooldescription="Add a grocery item to a store."
  toolautosubmit=""
>
  <select name="store_id" toolparamdescription="Target store"></select>
  <input name="item_name" toolparamdescription="Item name" required />
  <button type="submit">Add</button>
</form>
```

Imperitive - with JS

```js
navigator.modelContext.registerTool(
  {
    name: "get_stores",
    description: "List stores and item counts.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => JSON.stringify(stores, null, 2),
  },
  { signal: controller.signal },
);
```

Using it

```js
// Get a list of tools
const tools = navigator.modelContextTesting?.listTools();
// Run a tool (usually run by an agent)
await navigator.modelContextTesting?.executeTool("get_stores", "{}");
```

This is great for a few reasons:

1. You use the browser's built in secureity model. Auth, isn't an issue. etc...
2. Existing websites can easily expose site functionality. Often just a plugin
3. User is in control
4. You aren't limited by sandboxing security model??

## Security - nix?

Security is an issue.

- MCP Apps use a sandbox — iframed
- Arrow JS uses a sandbox
- Remote DOM (Shopify): https://github.com/Shopify/remote-dom

WebMCP uses the browser's security model. The only implementation right now is from Google, but I don't see why we couldn't have something that works across tabs.

## The Future

I think the future will be multi-faceted.

Code Mode over static, rigid moves

## Conclusion

https://www.youtube.com/watch?v=6Po39iD6Pfs

- Lego blocks of components alone don't make a good experience. While much of good UX can be systematized into rules, examples, and suggestions, designers know better in many cases.

- Components are king.

- Speed and consistency are a huge factor

- Balance of low power "Oh you can't use web APIs" and full control is a constant battle.
  - I don't want a watered down experience. We learned this with OpenClaw.
- Abuse. We are working so hard to fight bots and spam, but we're also just giving them the keys?
- Brand consistency and UX
- Power battle. I'm wondering things like: will the airline simply want to be distilled down into a utility? Have you tried to book a flight recently? Seat selection upsells, scare-tactics for insurance and re-booking fees. As a user I want these things, but I doubt businesses will totally buy in. [NOTE: maybe put this at the end — mention the API wars]

- Can the LLM make a 100% better UI? Maybe. Can the avg user? I don't think so.

I think Agentic UI will be about customizing experiences, smart defaults, suggestive UI, contextual components.

Just like when mobile and voice hit, the surface area for our apps has expanded and how we use our apps has changed.

It's on us as developers to figure that out to figure out which of these interfaces will work to provide delightful interfaces for our users.

```

```

Things to add:

We have instructions on how things work -> Those are skills

APIs → MCP servers, CLI tooling, Tools

For UI we don't really have a ton

I think the future of UI will be two things:

1. "Code mode" inside MCP Apps
2. WebMCP

Right now I need two things:

1. A demo of the WebMCP. Controlling it from outside maybe?
2. A demo of MCP Apps.
