---
title: Looking inside a model
date: 2026-09-10
categories: [Mechanistic interpretability, AI safety]
demo: true
description: From observing activations to asking what a model is actually computing.
---
This is a **demonstration article**, included to preview the reading experience. It is not a claim about research I have completed.

## From predictions to mechanisms

A model’s output tells us what it predicted. Understanding the computation behind that prediction is a different question. Mechanistic interpretability studies those internal computations.[^1]

One starting point is to inspect an activation and ask how it changes across inputs. A useful experiment needs a hypothesis, a controlled intervention, and a way to check the result.

> A visualization can suggest a question. An intervention can help test it.

## A small technical example

A linear transformation can be written as $y = Wx + b$. For a softmax distribution:

$$
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

```python
import torch

def activation_difference(clean, modified):
    return (clean - modified).norm(dim=-1)
```

| Observation | Next question |
| --- | --- |
| An activation changes | Does the change affect the output? |
| An intervention changes a prediction | Is the effect consistent across examples? |

[^1]: This sample illustrates footnotes and formatting. Replace it with your own writing and references.
