# Analysing Cytometry Data with R: An Open-Source Path to Reproducible Analysis

## Why This Guide Exists
At research institutions everywhere, cytometry is a core technology - but analysis often gets bottlenecked. FlowJo is widely used because it's visual, intuitive, and fast for exploring data. But when you need to process dozens of samples with identical analysis, or when you want to try methods that aren't available in commercial software, you need different tools.

This guide exists to teach you those tools.

## The Real Problems R Solves
**The 50-sample problem:** You have 50 samples that need identical gating, population analysis, and statistical comparisons. In FlowJo, that means one workspace holding dozens of files, which gets slow to browse and easy to lose track of. In R, that's one script applied to all samples.

**The cutting-edge problem:** A new clustering algorithm gets published. It appears as an R package within weeks, but takes years to appear in commercial software - if it ever does.

**The budget problem**: FlowJo licenses cost a few hundred dollars per year for academic use, more for commercial licenses. For students, postdocs, or researchers at institutions with tight budgets, R provides a complete alternative at no cost.

**The sharing problem:** You want to share your exact analysis methods with collaborators. With FlowJo, you share screenshots and approximate descriptions. With R, you share the actual code.

### What Programming Means

Before we go further, let's clarify what "programming" actually means, since this guide assumes you've never done it.
Programming is writing instructions for computers in a language they understand. Instead of clicking buttons, you type commands. Instead of remembering what you clicked, the computer remembers the commands you wrote.

**Example:** Instead of clicking through FlowJo menus to create a plot, you write:


``` r
autoplot(FLOWSET, x = "CD34", y = "CD38")
```

The advantage isn't obvious when you're learning, but it becomes powerful when you need to create 50 identical plots or when you want to modify something slightly across an entire analysis.

### What R Is
R is a programming language designed for data analysis. It was created by statisticians, for statisticians, which means it excels at the kinds of tasks cytometry analysis requires: data manipulation, visualisation, and statistical testing.
Key concepts:

**Language:** A set of rules for writing instructions computers can follow

**Open source:** Free to use, modify, and share

**Package system:** Extensions that add new capabilities

**Community:** Thousands of researchers contributing methods and tools

### What You'll Learn
This guide teaches you to use R specifically for cytometry analysis. You won't become a general programmer, but you'll gain capabilities that are difficult or impossible with commercial software.

**By Chapter 5:** You'll load cytometry data into R

**By Chapter 6:** You'll create your first cytometry plots

**By Chapter 9:** You'll have clean, analysis-ready data, channel names corrected, anomalies removed, with an optional look at gating directly in R along the way

**By Chapter 15:** You'll use advanced clustering methods to discover populations

**By the end:** You'll have reproducible workflows, and publication-quality figures, you can apply to new experiments

## The Learning Path
- Chapters 2-4: Get R working and set up your project and data structure
- Chapter 5: Load your first cytometry data
- Chapter 6: Your first cytometry plots
- Chapter 7: An optional look at gating done directly in R
- Chapters 8-9: Correct channel names, remove acquisition anomalies
- Chapter 10: Downsample for computational efficiency
- Chapter 11: Transform data for analysis and visualisation
- Chapter 12: Extract and label the expression data
- Chapter 13: Deeper visualisation techniques
- Chapters 14-15: Reduce dimensionality and discover populations through clustering
- Chapter 16: Statistical analysis and publication-quality figures

Each chapter builds on previous concepts. The early chapters may feel slow, but they establish foundations that make advanced analysis possible.

## What Makes This Different

Most R tutorials assume programming experience or rush through fundamentals. This guide assumes you know cytometry but treats programming as completely new territory.

Two-track approach:

[**Essentials:**]{.essentials} Working code that gets results quickly

[**Deeper Dive:**]{.deeper-dive} Understanding and customisation options

Use Essentials if you want immediate results. Read Deeper Dive when you want to understand why something works or how to modify it.

## The Honest Assessment

Learning R requires effort. The first few chapters involve setup and learning new vocabulary. But the payoff comes surprisingly quickly - by Chapter 13, you'll be running clustering analysis that would take hours, or simply isn't possible, in FlowJo.
When R wins: Batch processing, new methods, reproducible analysis, integration with other data types
When FlowJo wins: Interactive exploration, manual gating, immediate visual feedback
Use the right tool for each job. This guide teaches you when and how to use R effectively.

## Before You Begin

This guide uses a real dataset provided for you, so everyone works from identical data and gets identical results to check against. You can substitute your own FCS files at any point once you're comfortable with the workflow, Chapter 4 covers both options.

The next chapter gets R installed and working on your computer. You don't need any programming experience - just patience with setup and willingness to learn a new approach to familiar problems.

**What you'll need:**

- A computer with internet access
- About 2GB of free disk space
- Willingness to type commands instead of clicking buttons
- Curiosity about what becomes possible

## A Note on Learning

Programming feels different from other learning. You'll encounter error messages, unexpected outputs, and moments of confusion. This is normal and temporary. Every programmer - including the experts - deals with these same challenges.
The key is building understanding gradually. Each chapter introduces a few new concepts and shows how they connect to what you already know. By the end, you'll have gained a new set of analytical capabilities that expand what's possible with your cytometry data.
Ready to begin? The next chapter will get R installed and introduce you to the programming environment we'll use throughout this course.
