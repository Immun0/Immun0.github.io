--- 
title: "Analysing Cytometry Data with R"
author: 
- 'Damian Carragher'
- 'StemCore Laboratories and Flow Cytometry Core'
- 'Ottawa Hospital Research Institute'
- 'First edition by Damian Carragher'
date: 'Last Revised 2026-08-11'
site: bookdown::bookdown_site
documentclass: book
bibliography: [book.bib, packages.bib]
# url: your book url like https://bookdown.org/yihui/bookdown
# cover-image: path to the social sharing image like images/cover.jpg
description: |
  This is a complete introduction to analysing cytometry data with R, starting with how to set up an RStudio environment working through to producing journal quality figures
biblio-style: apalike
csl: chicago-fullnote-bibliography.csl
---



# Preface and Notes

Welcome to *Analysing Cytometry Data with R*

This book is your step-by-step guide to mastering cytometry data analysis using R. Whether you're completely new to programming or have wrestled with R before, we've designed this resource to actually get you analysing data.

## What This Isn't

While we'll give you everything necessary to analyse cytometry data, this is not a complete introduction to R programming. Your R education will have some gaps. If you catch the R bug and want broader training, R for Data Science is fantastic and freely available. Think of this as learning to drive before studying automotive engineering.

## Who This Is For

This book is for anyone who stares at piles of .FCS files and needs a better way to analyse them. We assume you know cytometry but have never programmed - or tried programming and bounced off other tutorials that assumed too much.

You might be:
- A student or postdoc who can't afford FlowJo's yearly license fees
- A researcher at an institution with limited software budgets
- Someone who wants to apply cutting-edge analysis methods not available in commercial software
- Anyone tired of clicking through the same analysis on hundreds of files

## Why Choose R?

**When you don't have FlowJo:** R provides a complete, free alternative for cytometry analysis. Everything FlowJo can do, R can do - though sometimes with more effort.

**When you do have FlowJo:** R excels where FlowJo struggles:
- Batch processing dozens or hundreds of files consistently
- Advanced clustering and dimensionality reduction algorithms
- Integrating cytometry data with genomics or clinical data
- Creating custom publication-quality visualisations
- Accessing the latest computational methods before commercial implementation

We'll be honest: for manual gating, FlowJo is usually easier. Use the right tool for the job. But for everything after gating - transformation, clustering, advanced analysis, batch processing - R is often superior.

## What You'll Actually Accomplish

* Set up R and load cytometry data properly
* Apply transformations and cleaning that work consistently across experiments
* Use automated clustering to discover populations you might miss manually
* Generate reproducible analysis pipelines you can apply to future datasets
* Create publication-quality figures that tell your data's story

## The Reality Check

This will take effort. R has a learning curve. But the payoff comes surprisingly quickly - by Chapter 5, you'll be doing analysis that's difficult or impossible in commercial software.

## Example Data You'll Master

We'll work with bone marrow samples comparing fixation methods. Real data with real differences, chosen because it demonstrates techniques you can apply to your own research.

## A Note on Code

Our code prioritizes clarity over efficiency. Each step is broken down so you understand what's happening. Once you're comfortable, optimise away. But first, let's get you analysing data.

Ready to add R to your cytometry toolkit?
