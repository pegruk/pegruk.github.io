---
title: Notes from building a small API
date: 2026-09-06
categories: [Backend development]
demo: true
description: What building a small API can teach us about contracts, errors, and clear decisions.
---
This demonstration post previews a backend development note.

## Start with the contract

Before implementing an endpoint, write down what it accepts, what it returns, and what a caller sees when something goes wrong.

```javascript
const response = await fetch('/api/notes');
if (!response.ok) throw new Error('Could not load notes');
const notes = await response.json();
```

For a portfolio write-up, describe the problem, explain one important design decision, and link to the actual project when it is ready.
