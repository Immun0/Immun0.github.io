# Chapter 4 - File Management and Data Access

## What We're Building

Before we can analyse cytometry data, we need to organise our work properly. Think of this like setting up a laboratory - you need specific places for raw samples, processed data, and results. In R, we create a structured folder system and use tools that make file management consistent and portable.

We'll accomplish three things:

1. Create an organised folder structure for the course
2. Set up an R Project so file paths work reliably
3. Download and verify the course datasets

## Version Notes

**File hosting:** Course data is available via GitHub Releases (Zenodo planned as a backup once beta testing is complete)
**Dataset structure:** One set of FCS files, already normalised, debarcoded, and gated to live singlets, plus a staged `RDS/` folder that lets you jump into any later chapter without rerunning earlier ones
**Approach:** Uses R Projects and the `here` package for portable file paths

## The Essentials {.essentials}

### Step 1: Create Your Project Folder

Create a folder on your computer where you have plenty of space (the datasets total about 400MB). Name it something clear like `Cytometry_R_Course`.

**Where to create it:** Anywhere you can easily find it - Desktop, Documents, or a dedicated projects folder all work fine.

### Step 2: Create an R Project

An R Project is a special file that tells RStudio where your work lives. This makes file management much easier.

1. Open RStudio
2. Click File > New Project
3. Choose "Existing Directory"
4. Navigate to the folder you just created
5. Click "Create Project"

**What this does:** Creates a file ending in `.Rproj` in your folder. When you open this file, RStudio automatically sets your working directory correctly.

### Step 3: Create Your Folder Structure with dir.create()

Every chapter in this course reads and writes files using the `here` package, always relative to this structure:

```
Cytometry_R_Course/
├── Cytometry_R_Course.Rproj
├── Data/
│   ├── fcs/                # 5 .fcs files, already normalised, debarcoded, and gated to live singlets
│   ├── ungated/            # the same 5 samples before gating, only needed for the optional Gating chapter's demo
│   ├── RDS/                # processed R objects, one file per pipeline stage
│   └── other/              # catchall for peripheral/supporting files, e.g. sample_info.csv
├── Scripts/                # your chapter scripts, plus the provided palette.R and backup/
├── Figures/                # empty for now - plots get saved here
├── Tables/                 # empty for now - summary tables get saved here
└── Outputs/                # empty for now - diagnostic reports from packages like flowCut get saved here
```

`dir.create()` is a real, general-purpose skill, not just a course setup step. Any time you start a new analysis and want to stay on the command line rather than clicking through a file explorer, this is how you'll build your folder structure. Create all of it now:


``` r
library(here)
#> Warning in readLines(f, n): line 1 appears to contain an
#> embedded nul
#> here() starts at /Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R
dir.create(here("Data", "RDS"), recursive = TRUE, showWarnings = FALSE)
dir.create(here("Scripts"), showWarnings = FALSE)
dir.create(here("Figures"), showWarnings = FALSE)
dir.create(here("Tables"), showWarnings = FALSE)
dir.create(here("Outputs"), showWarnings = FALSE)
```

### Step 4: Download This Course's Data

This step is specific to this course, and it's a bit artificial: in your own future analyses, your `Data/fcs/` and `Data/other/` folders would fill up with your own instrument output, not a downloaded ZIP. Here, everyone needs to start from identical data, so we provide it as one package. We only give you the final, ready-to-use data, not every intermediate processing stage, so you're not stuck storing gigabytes you'll never use.

Download the course datasets from: [**ACDwR-course-data-v1.zip**](https://github.com/Immun0/Analysing-Cytometry-Data-With-R-2026/releases/download/Data/ACDwR-course-data-v1.zip) (299 MB)

**What you're downloading:** A ZIP file containing:

- FCS files, already normalised, debarcoded, and gated to live singlets (`Data/fcs/`)
- Peripheral/supporting files, e.g. sample metadata (`Data/other/`)
- A starter set of provided RDS files (`Data/RDS/`), so you can jump ahead to any chapter

Extract the ZIP file into the folder structure you just created with `dir.create()` above.

**Download the scripts too:** [**ACDwR-scripts-v1.zip**](https://github.com/Immun0/Analysing-Cytometry-Data-With-R-2026/releases/download/Data/ACDwR-scripts-v1.zip). It is tiny, and it extracts into the same folder. It holds two things:

- `Scripts/palette.R`, one shared colour definition that Chapters 13 and 14 both load. Without it those chapters stop with a file-not-found error.
- `Scripts/backup/`, a working script for every chapter from 3 to 16, generated from this book. This is a safety net, not your copy of the course. When your own script will not run, open both and find the line that differs. Chapters 1 and 2 have no code worth keeping in a file, which is why the numbering starts at 3.

**Note:** `Data/ungated/` isn't part of this main download. It's the same 5 samples before gating, only needed if you do the optional Gating chapter's (Chapter 7) hands-on demo, and is provided separately from there, since most learners won't need it.

Two files you'll use throughout this course live in `Data/other/`: a metadata sheet, one row per sample, recording things like the experimental condition and patient ID, used to label results and compare conditions later. And a panel sheet, listing every channel on the instrument alongside the actual marker name it measures, used to turn cryptic metal-tag channel names like `Nd145Di` into readable marker names like `CD4`. Both get used starting in later chapters, we're introducing them here so their purpose is clear before that code shows up.

### Step 5: Work in a Script, Not the Console

Everything so far has gone into the Console. That was right for it: checking your R version is a one-off, and installing packages in Chapter 3 is something nobody keeps. Analysis is different. Console lines are not saved, so when you close RStudio they are gone, and with them any record of what you ran, in what order, and what you changed when something did not work.

From here on, the code in this course goes in a script, and the script goes in the `Scripts/` folder you just created.

1. **File > New File > R Script.** A pane opens at the top left, the Source pane.
2. **File > Save**, navigate into `Scripts/`, and name it `04-File-Management.R`.
3. Type or paste the code into the script rather than into the Console.
4. Leave the cursor on the line you want and press **Ctrl+Enter** (Windows and Linux) or **Cmd+Enter** (Mac). The line runs in the Console below and the cursor drops to the next line. Select several lines first and the same keys run all of them in order.

The Console has not gone anywhere. It still runs the code and prints the results and the errors. What changes is that the script keeps a copy, so tomorrow you open the file and re-run it instead of rebuilding it from memory.

**Run the rest of this chapter from that script**, starting with Step 6 below. Then keep one script per chapter, named for the chapter, so `Scripts/05-Data-Import.R` is next.

**Success check:** `Scripts/04-File-Management.R` exists, it is open in the Source pane, and pressing Ctrl+Enter on a line runs it in the Console below.

### Step 6: Verify here() Works


``` r
here()
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R"
```

**Success looks like this (Windows):**
```
[1] "C:/Users/YourName/Documents/Cytometry_R_Course"
```

**Success looks like this (Mac):**
```
[1] "/Users/YourName/Documents/Cytometry_R_Course"
```

**Problem looks like this:**
```
[1] "C:/Users/YourName/Documents"
```
If the path stops one level too early, or shows somewhere unexpected like your Downloads folder, RStudio didn't open via the `.Rproj` file. Close RStudio, then double-click `Cytometry_R_Course.Rproj` in File Explorer to reopen it correctly.

### Step 7: Verify Your Data

Check that the datasets are in the right place:


``` r
list.files(here("Data", "fcs"))
#> [1] "2PFANASPermLIVE.fcs"              
#> [2] "3_fcs-files_Live Singlets_R-Gated"
#> [3] "4PFA1GLUTNASPermLIVE.fcs"         
#> [4] "4PFANASPermLIVE.fcs"              
#> [5] "4PFANoPermLIVE.fcs"               
#> [6] "8PFANASPermLIVE.fcs"              
#> [7] "pruned"
```

**Success looks like this:**
```
[1] "2PFANASPermLIVE.fcs" "4PFA1GLUTNASPermLIVE.fcs" "4PFANASPermLIVE.fcs" "4PFANoPermLIVE.fcs" "8PFANASPermLIVE.fcs"
```

**Problem looks like this:**
```
character(0)
```
An empty result like this means the files aren't in `Data/fcs/`. On Windows, double-check the ZIP extracted the files directly into that folder rather than into a nested subfolder, Windows' built-in extractor sometimes creates an extra folder level named after the ZIP file.

You're now ready to load cytometry data in the next chapter.

## A Deeper Dive {.deeper-dive}

### Understanding Working Directories

A "working directory" is R's current location in your computer's file system. It's like R's "you are here" marker. When you tell R to load a file, it looks in the working directory unless you specify a complete path.

**Check your working directory:**

``` r
getwd()
```

**Why this matters:** If R is in the wrong place, it won't find your files. R Projects solve this by automatically setting the working directory to your project folder.

### What R Projects Actually Do

An R Project is a file that RStudio recognises. When you open a `.Rproj` file, RStudio:

1. Sets the working directory to the project folder
2. Remembers which files you had open
3. Restores your previous workspace settings

This means you can close RStudio, reopen the project later, and everything works exactly as before.

### File Paths in R

**Forward slashes vs backslashes:**
Windows uses backslashes in file paths: `C:\Users\Name\Documents`
R uses forward slashes: `C:/Users/Name/Documents`

The backslash `\` is an "escape character" in R, it has special meaning in the programming language. Using forward slashes avoids confusion.

**Absolute vs relative paths:**

Absolute path, complete location from the drive root:

``` r
"C:/Users/YourName/Documents/Cytometry_R_Course/Data/fcs"
#> [1] "C:/Users/YourName/Documents/Cytometry_R_Course/Data/fcs"
```

Relative path, location from the current working directory:

``` r
"Data/fcs"
#> [1] "Data/fcs"
```

Relative paths are portable - they work on any computer as long as the folder structure stays the same.

### The here Package in Detail

The `here` package builds file paths relative to your project root. This solves the portability problem.

**Without here:**

``` r
# This only works on your computer
data <- read.csv("C:/Users/YourName/Cytometry_R_Course/Data/other/samples.csv")
```

**With here:**

``` r
# This works on anyone's computer
data <- read.csv(here("Data", "other", "samples.csv"))
```

**How here finds your project:**
It looks for special files that indicate a project root:

1. `.Rproj` files (highest priority)
2. `.here` files
3. `.git` folders (for version control)

When you use `here()`, it builds paths starting from wherever it found one of these markers.

**Building paths with here:**

``` r
here()                                     # Project root
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R"
here("Data")                               # Data folder
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R/Data"
here("Data", "fcs")                 # FCS subfolder
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R/Data/fcs"
here("Data", "fcs", "2PFANASPermLIVE.fcs")  # A specific file
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R/Data/fcs/2PFANASPermLIVE.fcs"
```

R automatically adds the correct separators between each component.

### Why Just One Version of the FCS Data?

The `Data/fcs/` files you download are already normalised, debarcoded, and gated to live singlets, the final, ready-to-analyse state, not raw instrument output. We don't ship every intermediate processing stage (there can be several, each several times the size of the final files), just the data you'll actually work with throughout the course.

The one exception is the Gating chapter, which demonstrates removing debris, doublets, and dead cells directly in R. That needs data which still has those events in it, so it uses its own separate example file, outside this project's folder structure entirely. The chapter itself tells you how to get that file when you reach it.

### Why a Staged RDS Folder?

Every processing step in this course, cleaning, gating, downsampling, transforming, clustering, saves its result as an RDS file in `Data/RDS/`, named to describe exactly what's been done to it (for example `ARCSINH_DOWNSAMPLED_CLEANED_FLOWSET.rds` means cleaned, then downsampled, then arcsinh-transformed, in that order). We also ship a starter set of these files pre-made.

This means you don't have to run every chapter in sequence to reach the one you're interested in. Want to jump straight to clustering? Load the RDS file that matches the state clustering expects, and go. The one exception is Chapters 1-5: those chapters teach you how to set up this folder structure and import data in the first place, so we don't hand you a pre-built version of them. Everything from Chapter 6 onward is fair game to skip into directly.

### File Organisation Best Practices

**Recommended structure for cytometry analysis:**
```
Project_Root/
├── Data/
│   ├── fcs/              # Original FCS files (never modify)
│   ├── RDS/              # Processed R objects, one per pipeline stage
│   └── other/            # Catchall for peripheral/supporting files
├── Scripts/              # R code files
├── Figures/              # Plots and visualisations
├── Tables/               # Statistical summaries
└── Outputs/              # Diagnostic reports from packages like flowCut
```

Keep this flat rather than nesting `Figures/` and `Tables/` inside a `Results/` folder. One less level to type in every `here()` call, and one less thing to get wrong.

**Principles:**

- Keep raw data separate and unmodified
- Use clear, descriptive folder and file names
- Group related files together
- Make structure consistent across the whole course

### Creating Folders and Files

**Create a new folder:**

``` r
dir.create(here("Scripts"))
```

**Create multiple folders at once:**

``` r
dir.create(here("Figures"))
dir.create(here("Tables"))
```

**Warning:** Creating and deleting files in R is permanent. There's no recycle bin or undo. When learning, it's safer to create folders manually in your file explorer.

### Navigating Folders in R

**List folders (directories) in current location:**

``` r
list.dirs()
#>    [1] "."                                                                                                  
#>    [2] "./_book"                                                                                            
#>    [3] "./_bookdown_files"                                                                                  
#>    [4] "./.git"                                                                                             
#>    [5] "./.git/hooks"                                                                                       
#>    [6] "./.git/info"                                                                                        
#>    [7] "./.git/logs"                                                                                        
#>    [8] "./.git/logs/refs"                                                                                   
#>    [9] "./.git/logs/refs/heads"                                                                             
#>   [10] "./.git/logs/refs/remotes"                                                                           
#>   [11] "./.git/logs/refs/remotes/origin"                                                                    
#>   [12] "./.git/objects"                                                                                     
#>   [13] "./.git/objects/09"                                                                                  
#>   [14] "./.git/objects/0d"                                                                                  
#>   [15] "./.git/objects/16"                                                                                  
#>   [16] "./.git/objects/17"                                                                                  
#>   [17] "./.git/objects/1e"                                                                                  
#>   [18] "./.git/objects/1f"                                                                                  
#>   [19] "./.git/objects/27"                                                                                  
#>   [20] "./.git/objects/29"                                                                                  
#>   [21] "./.git/objects/2f"                                                                                  
#>   [22] "./.git/objects/3d"                                                                                  
#>   [23] "./.git/objects/4b"                                                                                  
#>   [24] "./.git/objects/54"                                                                                  
#>   [25] "./.git/objects/5a"                                                                                  
#>   [26] "./.git/objects/60"                                                                                  
#>   [27] "./.git/objects/6a"                                                                                  
#>   [28] "./.git/objects/82"                                                                                  
#>   [29] "./.git/objects/87"                                                                                  
#>   [30] "./.git/objects/8a"                                                                                  
#>   [31] "./.git/objects/8d"                                                                                  
#>   [32] "./.git/objects/a0"                                                                                  
#>   [33] "./.git/objects/a5"                                                                                  
#>   [34] "./.git/objects/a7"                                                                                  
#>   [35] "./.git/objects/b2"                                                                                  
#>   [36] "./.git/objects/b7"                                                                                  
#>   [37] "./.git/objects/b8"                                                                                  
#>   [38] "./.git/objects/bd"                                                                                  
#>   [39] "./.git/objects/c4"                                                                                  
#>   [40] "./.git/objects/cb"                                                                                  
#>   [41] "./.git/objects/d8"                                                                                  
#>   [42] "./.git/objects/e0"                                                                                  
#>   [43] "./.git/objects/e3"                                                                                  
#>   [44] "./.git/objects/e4"                                                                                  
#>   [45] "./.git/objects/ee"                                                                                  
#>   [46] "./.git/objects/info"                                                                                
#>   [47] "./.git/objects/pack"                                                                                
#>   [48] "./.git/refs"                                                                                        
#>   [49] "./.git/refs/heads"                                                                                  
#>   [50] "./.git/refs/remotes"                                                                                
#>   [51] "./.git/refs/remotes/origin"                                                                         
#>   [52] "./.git/refs/tags"                                                                                   
#>   [53] "./.Rproj.user"                                                                                      
#>   [54] "./.Rproj.user/14051413"                                                                             
#>   [55] "./.Rproj.user/14051413/bibliography-index"                                                          
#>   [56] "./.Rproj.user/14051413/bookdown-crossref"                                                           
#>   [57] "./.Rproj.user/14051413/bookdown-crossref/Draft Chapters"                                            
#>   [58] "./.Rproj.user/14051413/ctx"                                                                         
#>   [59] "./.Rproj.user/14051413/explorer-cache"                                                              
#>   [60] "./.Rproj.user/14051413/pcs"                                                                         
#>   [61] "./.Rproj.user/14051413/presentation"                                                                
#>   [62] "./.Rproj.user/14051413/profiles-cache"                                                              
#>   [63] "./.Rproj.user/14051413/sources"                                                                     
#>   [64] "./.Rproj.user/14051413/sources/per"                                                                 
#>   [65] "./.Rproj.user/14051413/sources/per/t"                                                               
#>   [66] "./.Rproj.user/14051413/sources/per/u"                                                               
#>   [67] "./.Rproj.user/14051413/sources/prop"                                                                
#>   [68] "./.Rproj.user/14051413/tutorial"                                                                    
#>   [69] "./.Rproj.user/14051413/viewer_history"                                                              
#>   [70] "./.Rproj.user/14051413/viewer-cache"                                                                
#>   [71] "./.Rproj.user/5D1DEEE4"                                                                             
#>   [72] "./.Rproj.user/5D1DEEE4/bibliography-index"                                                          
#>   [73] "./.Rproj.user/5D1DEEE4/bookdown-crossref"                                                           
#>   [74] "./.Rproj.user/5D1DEEE4/bookdown-crossref/Draft Chapters"                                            
#>   [75] "./.Rproj.user/5D1DEEE4/ctx"                                                                         
#>   [76] "./.Rproj.user/5D1DEEE4/ctx/ctx-12177"                                                               
#>   [77] "./.Rproj.user/5D1DEEE4/ctx/ctx-12177/plots_dir"                                                     
#>   [78] "./.Rproj.user/5D1DEEE4/ctx/ctx-28667"                                                               
#>   [79] "./.Rproj.user/5D1DEEE4/ctx/ctx-28667/plots_dir"                                                     
#>   [80] "./.Rproj.user/5D1DEEE4/ctx/ctx-38729"                                                               
#>   [81] "./.Rproj.user/5D1DEEE4/explorer-cache"                                                              
#>   [82] "./.Rproj.user/5D1DEEE4/jobs"                                                                        
#>   [83] "./.Rproj.user/5D1DEEE4/pcs"                                                                         
#>   [84] "./.Rproj.user/5D1DEEE4/presentation"                                                                
#>   [85] "./.Rproj.user/5D1DEEE4/profiles-cache"                                                              
#>   [86] "./.Rproj.user/5D1DEEE4/sources"                                                                     
#>   [87] "./.Rproj.user/5D1DEEE4/sources/per"                                                                 
#>   [88] "./.Rproj.user/5D1DEEE4/sources/per/t"                                                               
#>   [89] "./.Rproj.user/5D1DEEE4/sources/per/u"                                                               
#>   [90] "./.Rproj.user/5D1DEEE4/sources/prop"                                                                
#>   [91] "./.Rproj.user/5D1DEEE4/sources/session-37a5442c"                                                    
#>   [92] "./.Rproj.user/5D1DEEE4/tutorial"                                                                    
#>   [93] "./.Rproj.user/5D1DEEE4/unsaved-notebooks"                                                           
#>   [94] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/3116FEEC"                                                  
#>   [95] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/3116FEEC/1"                                                
#>   [96] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/6F2C8379"                                                  
#>   [97] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/6F2C8379/1"                                                
#>   [98] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/8B6B3B6B"                                                  
#>   [99] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/8B6B3B6B/1"                                                
#>  [100] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/8B6B3B6B/1/chhr9zffmrawh"                                  
#>  [101] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/8B6B3B6B/1/crgidelpuq6cn"                                  
#>  [102] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/8B6B3B6B/1/czzuwy6hyhu79"                                  
#>  [103] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/AA55DE97"                                                  
#>  [104] "./.Rproj.user/5D1DEEE4/unsaved-notebooks/AA55DE97/1"                                                
#>  [105] "./.Rproj.user/5D1DEEE4/viewer_history"                                                              
#>  [106] "./.Rproj.user/5D1DEEE4/viewer-cache"                                                                
#>  [107] "./.Rproj.user/C6C557C8"                                                                             
#>  [108] "./.Rproj.user/C6C557C8/bibliography-index"                                                          
#>  [109] "./.Rproj.user/C6C557C8/bookdown-crossref"                                                           
#>  [110] "./.Rproj.user/C6C557C8/bookdown-crossref/Draft Chapters"                                            
#>  [111] "./.Rproj.user/C6C557C8/ctx"                                                                         
#>  [112] "./.Rproj.user/C6C557C8/explorer-cache"                                                              
#>  [113] "./.Rproj.user/C6C557C8/pcs"                                                                         
#>  [114] "./.Rproj.user/C6C557C8/presentation"                                                                
#>  [115] "./.Rproj.user/C6C557C8/profiles-cache"                                                              
#>  [116] "./.Rproj.user/C6C557C8/sources"                                                                     
#>  [117] "./.Rproj.user/C6C557C8/sources/per"                                                                 
#>  [118] "./.Rproj.user/C6C557C8/sources/per/t"                                                               
#>  [119] "./.Rproj.user/C6C557C8/sources/per/u"                                                               
#>  [120] "./.Rproj.user/C6C557C8/sources/prop"                                                                
#>  [121] "./.Rproj.user/C6C557C8/tutorial"                                                                    
#>  [122] "./.Rproj.user/C6C557C8/unsaved-notebooks"                                                           
#>  [123] "./.Rproj.user/C6C557C8/unsaved-notebooks/733BD921"                                                  
#>  [124] "./.Rproj.user/C6C557C8/viewer_history"                                                              
#>  [125] "./.Rproj.user/C6C557C8/viewer-cache"                                                                
#>  [126] "./.Rproj.user/shared"                                                                               
#>  [127] "./.Rproj.user/shared/notebooks"                                                                     
#>  [128] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction"                                
#>  [129] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1"                              
#>  [130] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/5D1DEEE43ad81c22"             
#>  [131] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s"                            
#>  [132] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c02jgo7syq59e"              
#>  [133] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c06dlybq4zb25"              
#>  [134] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c0c7vggti3s9z"              
#>  [135] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c0df1p1krm8dl"              
#>  [136] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c0idry6lpluig"              
#>  [137] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c0thp1oqrpinu"              
#>  [138] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c102ga7df7idu"              
#>  [139] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1c3j910cvrqg"              
#>  [140] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1g0hzjoas0tc"              
#>  [141] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1gz21bj3jpqf"              
#>  [142] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1j2273p71cch"              
#>  [143] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1juwyky89lxf"              
#>  [144] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1kp3mzh4p428"              
#>  [145] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1mhdf4l5ws00"              
#>  [146] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c1ofsp0evfwmu"              
#>  [147] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c21g38itq6b0i"              
#>  [148] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2222kmxp1mop"              
#>  [149] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c23aag9ks9dia"              
#>  [150] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c25bcx9v0ezwp"              
#>  [151] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2f8sa3nnd10h"              
#>  [152] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2j8wupp0ld86"              
#>  [153] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2kjf3box1xni"              
#>  [154] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2xm66xdfku65"              
#>  [155] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c2zasp56wbymn"              
#>  [156] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c307am2av05dt"              
#>  [157] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c33anlgf2ucjl"              
#>  [158] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c3vgx8cl4r6wj"              
#>  [159] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4di5sfkasiv2"              
#>  [160] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4lslkwrgy7bu"              
#>  [161] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4o34jos5a3q7"              
#>  [162] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4phwa9tl0u4b"              
#>  [163] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4r58632seh44"              
#>  [164] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4v05m79k9xsn"              
#>  [165] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4vhzb29gz25n"              
#>  [166] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c4x31jueb4ol3"              
#>  [167] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c56stj8ojcfek"              
#>  [168] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c586nw5f6zfpn"              
#>  [169] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c58z3yrmrckg8"              
#>  [170] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c5aibijj9fn1o"              
#>  [171] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c5jze6zih0q5l"              
#>  [172] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c5kb1lelb3c41"              
#>  [173] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c5kdgtzzmmdqz"              
#>  [174] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c5oquph7wgmi9"              
#>  [175] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c6cufi7wzs39v"              
#>  [176] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c6nb08fvklbfh"              
#>  [177] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c6oxd9wxgh4l5"              
#>  [178] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c6rgdn72936g0"              
#>  [179] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c6xym5t6j3jfx"              
#>  [180] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c72mldu1vho56"              
#>  [181] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c76sp2p15rmrk"              
#>  [182] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7adks37na9ka"              
#>  [183] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7ayrbduf8ucy"              
#>  [184] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7difgq0vztiz"              
#>  [185] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7lnalrqernm2"              
#>  [186] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7op0afy96mek"              
#>  [187] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c7up3bvm6d06h"              
#>  [188] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c8105slk4ip07"              
#>  [189] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c829onfg2ep1q"              
#>  [190] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c8egfn159nbtc"              
#>  [191] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c8gvxf2n0s2ut"              
#>  [192] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c8k9aqw0z288f"              
#>  [193] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c8qhsns6qc3db"              
#>  [194] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c911iktcpw6t8"              
#>  [195] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c913c2m2u08wu"              
#>  [196] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9bbw81e7motw"              
#>  [197] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9bsn4ltqk26p"              
#>  [198] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9cfjf0zxzuyf"              
#>  [199] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9fdjg8ra7fzy"              
#>  [200] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9ws0i05ghocy"              
#>  [201] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/c9zjsk3vr00zs"              
#>  [202] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cadbon30l327c"              
#>  [203] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cae6v2b1no9zi"              
#>  [204] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/caetw3q86cqji"              
#>  [205] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cai04qozxpjs6"              
#>  [206] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/capvndxsfkeb3"              
#>  [207] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cavrhxk3u6vns"              
#>  [208] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cb4zv6gm278fn"              
#>  [209] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cbf2gkjo20add"              
#>  [210] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cbkoy32dtgzjz"              
#>  [211] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cbokgqml8aigj"              
#>  [212] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cbp9uuwol1o98"              
#>  [213] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cc6ge2z0xxyub"              
#>  [214] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ccqxjjv4pw9f2"              
#>  [215] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ccr5993fo3w5j"              
#>  [216] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ccz3g3g75lpl7"              
#>  [217] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cd16qz5fe51mn"              
#>  [218] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdcw8q8482zsk"              
#>  [219] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdilj8667n3ax"              
#>  [220] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdl5z3ba1a4w5"              
#>  [221] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdlyl7pi2z282"              
#>  [222] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdmx9dfa93hdn"              
#>  [223] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cdpd60r6u2hvg"              
#>  [224] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ced1y330l546c"              
#>  [225] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ceo3nca3iveq5"              
#>  [226] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ceskdf25179gm"              
#>  [227] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cezavr0wep4tt"              
#>  [228] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cfdosbtl7iqgw"              
#>  [229] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cffs68z2yyt5y"              
#>  [230] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cg3fq87xvo7aq"              
#>  [231] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cg4v65i0awz9t"              
#>  [232] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cg54c4waoosn6"              
#>  [233] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cg8696ixdbijx"              
#>  [234] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cgb4n8jdtcst2"              
#>  [235] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cgbmci7vg027m"              
#>  [236] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cgmzct3s52ehp"              
#>  [237] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ch3eklhgw0um9"              
#>  [238] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/chdeo55kom7ld"              
#>  [239] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/chggvak4ggmpd"              
#>  [240] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/chktb39u7zjhz"              
#>  [241] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/chviqe0ollr2u"              
#>  [242] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/chzhn6vliapiv"              
#>  [243] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ci2xv0fmy5td7"              
#>  [244] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ci4rgnj100mnw"              
#>  [245] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ci53yon1e4wb5"              
#>  [246] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cibdcrjj23xbc"              
#>  [247] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/civ0n7la2ops7"              
#>  [248] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ciy6cdpufn7nz"              
#>  [249] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cizydesp96t6z"              
#>  [250] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cj5z7i965klei"              
#>  [251] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cjb4u0j53ld4u"              
#>  [252] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cjicgi3v0mzdj"              
#>  [253] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cjkjd49trr2xq"              
#>  [254] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ck1idktwqq0j0"              
#>  [255] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ck2hay3d4juxf"              
#>  [256] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ck358pwwi86jk"              
#>  [257] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ck8jm34jowzro"              
#>  [258] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ckjpbzxljoals"              
#>  [259] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ckolwbu7320zj"              
#>  [260] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cl05sq0jk4ppc"              
#>  [261] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cl21f24pci255"              
#>  [262] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cl2cltqzjsw2i"              
#>  [263] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/clqg3ucxp2w9a"              
#>  [264] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cm1kdzkwcuoj7"              
#>  [265] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cm67mfyv5oafc"              
#>  [266] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmdwfjoeif7kf"              
#>  [267] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmiwj853y351c"              
#>  [268] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmsva9uwztcjb"              
#>  [269] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmv5nn3lp3fqe"              
#>  [270] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmvk4ihesu0j2"              
#>  [271] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmvnfkb3arhfm"              
#>  [272] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmyyvzkknc31a"              
#>  [273] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cmzxo70rbql3l"              
#>  [274] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cn77jp7v5hm1u"              
#>  [275] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cnbadzvaw8if4"              
#>  [276] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cnq81yymte6e2"              
#>  [277] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/covaw7rljidmq"              
#>  [278] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cp6kumode5803"              
#>  [279] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cp8a9pl008jmi"              
#>  [280] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cpc609tb7lzwq"              
#>  [281] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cpecf8597qypr"              
#>  [282] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cpf4ivllilj8d"              
#>  [283] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cppmnnyn9t03b"              
#>  [284] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cq2ti6g9ukbz4"              
#>  [285] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cq5hqpcddmfg9"              
#>  [286] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cqgdda9jmjitg"              
#>  [287] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cqpo1oo5hj6at"              
#>  [288] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cr1ccgwobq0pr"              
#>  [289] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cr48rcv4mwfd7"              
#>  [290] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cr9ydf17jzyak"              
#>  [291] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/crihwegrzs9bv"              
#>  [292] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/crp36xejet0tj"              
#>  [293] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/crr5nvrpeakgv"              
#>  [294] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/crz9zgmp0825i"              
#>  [295] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/csftnfxztxw3a"              
#>  [296] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/csneor30hjwt3"              
#>  [297] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ct08jaw0li0wx"              
#>  [298] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ct0pgn7mhoyai"              
#>  [299] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ct1ukdjqmgmrt"              
#>  [300] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ct61g5uz6jkrx"              
#>  [301] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ctbj1i124p9t6"              
#>  [302] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ctdxo7w00umz1"              
#>  [303] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ctkouyqqlbqgg"              
#>  [304] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ctnp0xensowqn"              
#>  [305] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/ctsgogmnkuiyo"              
#>  [306] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cuhvjdo7lta7r"              
#>  [307] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cuouqtnxlb2zo"              
#>  [308] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cuxwm0giqhh8q"              
#>  [309] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cvellbga4akjb"              
#>  [310] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cvqikd9q81hjk"              
#>  [311] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cvrx5gpvtyb6s"              
#>  [312] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cw0x1ip7p76jd"              
#>  [313] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cwhrvpp6mlnsy"              
#>  [314] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx0x48olao08z"              
#>  [315] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx1w0id4ipllb"              
#>  [316] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx2ikcm3oq2gn"              
#>  [317] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx5lm8mabjmgt"              
#>  [318] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx8mjlmu8t0rm"              
#>  [319] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cx9aw6dzbsd5t"              
#>  [320] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxf2mc27qjpo5"              
#>  [321] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxgunnyjnyfxf"              
#>  [322] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxh3smv2piw09"              
#>  [323] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxigd0sraszqt"              
#>  [324] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxkrypoki8qd9"              
#>  [325] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cxr6h6tqf7bgp"              
#>  [326] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cygnlhome9pgy"              
#>  [327] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cyh88i6fywk4w"              
#>  [328] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cymaw7zymgs4y"              
#>  [329] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cz3r3lugik13f"              
#>  [330] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cz5s4dhhoumt5"              
#>  [331] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/cz5xc42wyyhrf"              
#>  [332] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/czencfuw0owb1"              
#>  [333] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/czgu0xnvzshku"              
#>  [334] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/czoz9lt22o219"              
#>  [335] "./.Rproj.user/shared/notebooks/063F4FBB-14-Dimensionality-Reduction/1/s/czpx0cp9ucpd2"              
#>  [336] "./.Rproj.user/shared/notebooks/07EA065D-01-Introduction"                                            
#>  [337] "./.Rproj.user/shared/notebooks/07EA065D-01-Introduction/1"                                          
#>  [338] "./.Rproj.user/shared/notebooks/07EA065D-01-Introduction/1/s"                                        
#>  [339] "./.Rproj.user/shared/notebooks/07EA065D-01-Introduction/1/s/cgmgldk7c2e9h"                          
#>  [340] "./.Rproj.user/shared/notebooks/18163A08-03-Packages"                                                
#>  [341] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1"                                              
#>  [342] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/5D1DEEE4ffcce124"                             
#>  [343] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s"                                            
#>  [344] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c005ggl4rtz6x"                              
#>  [345] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c01s0sc52fd1a"                              
#>  [346] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c0lvd0uj8lpom"                              
#>  [347] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c1av12ash12vg"                              
#>  [348] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c3f0vuljvpgfi"                              
#>  [349] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c5ei51rll67fl"                              
#>  [350] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c5go9ty5aeh4o"                              
#>  [351] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c7hpb5q9bbud9"                              
#>  [352] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c8b0nwy69e9oi"                              
#>  [353] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/c93tphw6vvl81"                              
#>  [354] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cb6vu1plga1uh"                              
#>  [355] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/ce09ku6nbfi3x"                              
#>  [356] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cf5g1jhjtfklr"                              
#>  [357] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cfsyf2ufe8mmq"                              
#>  [358] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/chrm22hbtu7nx"                              
#>  [359] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/chz9oz7yzrcwq"                              
#>  [360] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cina86n62ufhq"                              
#>  [361] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cj418bxxo4wzw"                              
#>  [362] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cj6aye11tbruc"                              
#>  [363] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cmt9bg0icmmoo"                              
#>  [364] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/ct6qb5wtg9hk8"                              
#>  [365] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cva6om4g1ts4q"                              
#>  [366] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cw4qdz71ukq5o"                              
#>  [367] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cwzahhayg4cry"                              
#>  [368] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cx30x3gyrmlmp"                              
#>  [369] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cyoz6b8mrmvto"                              
#>  [370] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/cyvnat0mvwjm7"                              
#>  [371] "./.Rproj.user/shared/notebooks/18163A08-03-Packages/1/s/czp8k1k99nlz8"                              
#>  [372] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names"                           
#>  [373] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1"                         
#>  [374] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/5D1DEEE4b3d301be"        
#>  [375] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s"                       
#>  [376] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c28peb82qpj42"         
#>  [377] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c2aa6hj5s7kaz"         
#>  [378] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c2xnq3wdjdnz5"         
#>  [379] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c4dab7lso9s0f"         
#>  [380] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c4m2lxvjkn0a2"         
#>  [381] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c4tvz7gdgxmam"         
#>  [382] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c4y8cpvn0ghvg"         
#>  [383] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c5gb93ecf57rh"         
#>  [384] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c628ymvqtkjlv"         
#>  [385] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c6978w93b8k6y"         
#>  [386] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c6b9qmwqngwaf"         
#>  [387] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c6mqv3ofwu909"         
#>  [388] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c6q6y3hq8kb2l"         
#>  [389] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c7b2zc0fhvlno"         
#>  [390] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c8sx3u132f6fe"         
#>  [391] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c9f4pyn0ssbfa"         
#>  [392] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c9nkkejf8upqo"         
#>  [393] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/c9utwcmesipxb"         
#>  [394] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cb6dem7lu1mmp"         
#>  [395] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cbsz9ngenk4r6"         
#>  [396] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cc174ula1pums"         
#>  [397] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cc5atmx69bk1q"         
#>  [398] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cc9kz80iwx1fd"         
#>  [399] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cc9kz80iwx1fd/temp"    
#>  [400] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/ccg65e9nnfnly"         
#>  [401] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/ccom0424vmv2d"         
#>  [402] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cecpn6e1vvrc3"         
#>  [403] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cenu97celwt3q"         
#>  [404] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cf92t23yzf5by"         
#>  [405] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cgdih67jmktyj"         
#>  [406] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cgdtimsqij9t9"         
#>  [407] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/chmpdfwvqy447"         
#>  [408] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/ci766rlkdcpe8"         
#>  [409] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/ci766rlkdcpe8/temp"    
#>  [410] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cj17nf3vgrf4k"         
#>  [411] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cjcu1rmi0cary"         
#>  [412] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cljm1wmhvq1cj"         
#>  [413] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cmj4e7nllamna"         
#>  [414] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cmql8fd9uw8ft"         
#>  [415] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cmrz0ax9u38v6"         
#>  [416] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cmzea191cshxj"         
#>  [417] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cpiss5z5m4v88"         
#>  [418] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cqgsulvlinr42"         
#>  [419] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cqr1j86kxt5l7"         
#>  [420] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cqy1h9rwo3d6m"         
#>  [421] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cr0m3u4bzhbkw"         
#>  [422] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cs9xu8iouw8gc"         
#>  [423] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/ct6jmwx6lqahk"         
#>  [424] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cty92h5znhfz2"         
#>  [425] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cu8jnyysmj8yx"         
#>  [426] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cxtkwttqsdikx"         
#>  [427] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cyzts0ks1hrj8"         
#>  [428] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/cz6ea8j0miq8i"         
#>  [429] "./.Rproj.user/shared/notebooks/214E625F-08-Data-Cleaning-2-Channel-Names/1/s/czxjlwxqixvrh"         
#>  [430] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup"                                     
#>  [431] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1"                                   
#>  [432] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s"                                 
#>  [433] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/c247nzn8ojmc1"                   
#>  [434] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/c2prg3hha5rjz"                   
#>  [435] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/caev3ofa3vfu4"                   
#>  [436] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cbn956jxldn8x"                   
#>  [437] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cg00lnuioeiei"                   
#>  [438] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cjwvezfnaga53"                   
#>  [439] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cl7oit2o2imd7"                   
#>  [440] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cllqbn6zix486"                   
#>  [441] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cm4gg473v3nxf"                   
#>  [442] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cm79qcazfrrg8"                   
#>  [443] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cnetjyhgg19nd"                   
#>  [444] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cno84qx80gqr7"                   
#>  [445] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cos5w6r7dwcf9"                   
#>  [446] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cp55x3n26zk4u"                   
#>  [447] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/crvaflnx6glbk"                   
#>  [448] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cv0wv5w2jr31l"                   
#>  [449] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cvtczpqt2vm6n"                   
#>  [450] "./.Rproj.user/shared/notebooks/2A0873F1-02-R-Environment-setup/1/s/cxepzxsy3k8q9"                   
#>  [451] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management"                                         
#>  [452] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1"                                       
#>  [453] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/5D1DEEE4ffcce124"                      
#>  [454] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s"                                     
#>  [455] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/c0igmwg0bthhg"                       
#>  [456] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/c60w1l2dwg6a4"                       
#>  [457] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/c7q5kybf3jhwt"                       
#>  [458] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/c97px006dpd06"                       
#>  [459] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cbcpwkf9h3znm"                       
#>  [460] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/ccu3stxvizels"                       
#>  [461] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cd7td4eu6f2a8"                       
#>  [462] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cdxef2nqj2w5m"                       
#>  [463] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cesln8n5j1c4c"                       
#>  [464] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cfws0kaq19d3k"                       
#>  [465] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/chbmh0ckwm2to"                       
#>  [466] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cllyeuxeg4twk"                       
#>  [467] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cq4pccbd97iga"                       
#>  [468] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/cqmnpewnd3zx7"                       
#>  [469] "./.Rproj.user/shared/notebooks/2FA3DDF9-04-File-Management/1/s/crfxy63hq96mv"                       
#>  [470] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data"                             
#>  [471] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1"                           
#>  [472] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/5D1DEEE4b3d301be"          
#>  [473] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/5D1DEEE4e706522d"          
#>  [474] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s"                         
#>  [475] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c01yzodt5yxpl"           
#>  [476] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c02nfmf5d93ga"           
#>  [477] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c05z3hxikqwyo"           
#>  [478] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c09uapzqqcw1i"           
#>  [479] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0emby5qryoli"           
#>  [480] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0hdtputl9cxr"           
#>  [481] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0ick6dsn0pnr"           
#>  [482] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0ml9r6mcyjad"           
#>  [483] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0rxsl16z5960"           
#>  [484] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0s35v29s8sqb"           
#>  [485] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c0txkw63cvlce"           
#>  [486] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c1e8vrdimz04k"           
#>  [487] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c1gsv5w093r2k"           
#>  [488] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c1kou2qbn7stj"           
#>  [489] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c1mt04qir9hge"           
#>  [490] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c24hyiu8yakj8"           
#>  [491] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2bvt6h2szcmr"           
#>  [492] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2evdy29msp0i"           
#>  [493] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2falhdkr5t6n"           
#>  [494] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2i8y3ctn1lv5"           
#>  [495] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2lt11qkp8jxc"           
#>  [496] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2mbntzzofrfe"           
#>  [497] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c2wr9f0et6qzn"           
#>  [498] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c31l6yp2gegzl"           
#>  [499] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c34v7lmuwdzxi"           
#>  [500] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c37lxqo5e7aof"           
#>  [501] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3aqzk6m37vcc"           
#>  [502] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3fidex30m7q2"           
#>  [503] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3l5xj90tbbmx"           
#>  [504] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3lhx27emdsmt"           
#>  [505] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3wklz4poyi7b"           
#>  [506] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c3wpzqfr16vrr"           
#>  [507] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c49z0e571dbaq"           
#>  [508] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4h9qqs1i7cqk"           
#>  [509] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4l9o7y85cdwj"           
#>  [510] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4pcif9cr26az"           
#>  [511] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4pekg8naf6ji"           
#>  [512] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4rq311euzk6g"           
#>  [513] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4sy7pb4l2aju"           
#>  [514] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4toabo8kvdqt"           
#>  [515] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4vnvjnlb7113"           
#>  [516] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c4wgu7vecigcp"           
#>  [517] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c5bedxsxuchez"           
#>  [518] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c5g7kz3o2k29s"           
#>  [519] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c5x9cxi2uuvyt"           
#>  [520] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c629wlypd8kpj"           
#>  [521] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c660co42ku0a8"           
#>  [522] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c67uw0ozswgqv"           
#>  [523] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c6ct5s72ycrbs"           
#>  [524] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c6sneztn3ddf1"           
#>  [525] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c79kczqfnbohk"           
#>  [526] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c7drsn2mwfiql"           
#>  [527] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c820tvv99cl3e"           
#>  [528] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c86iju364j94j"           
#>  [529] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c8ghpb3fgaktu"           
#>  [530] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c8hf0g4v25ddu"           
#>  [531] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c8vyxan2pi2tr"           
#>  [532] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c930ildtozlcl"           
#>  [533] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c94x5th6f6wie"           
#>  [534] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c96db13cq1235"           
#>  [535] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c96hbgzxkqygc"           
#>  [536] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9b6gginbrbf6"           
#>  [537] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9gws2r2ynrbb"           
#>  [538] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9hmyfwniuv8h"           
#>  [539] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9lhqdeb6qj22"           
#>  [540] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9pn2dx8iq6rf"           
#>  [541] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9prgd29did9z"           
#>  [542] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/c9tgjnmrz33uo"           
#>  [543] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/capvs2m2ydq3d"           
#>  [544] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/caqje9pbeo01q"           
#>  [545] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cb2hdudwtlldf"           
#>  [546] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cbf0ghbkrb63w"           
#>  [547] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cbp4mtidvso60"           
#>  [548] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cbqme84ta35bx"           
#>  [549] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cbs7gfupcqaig"           
#>  [550] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cc77i90vismy0"           
#>  [551] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cceebu420bpvm"           
#>  [552] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ccjd56y617xwb"           
#>  [553] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cck8zywjt21xd"           
#>  [554] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ccprrrjh0r28t"           
#>  [555] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ccpzw3h77j2ya"           
#>  [556] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ccx2ztv4gs2oo"           
#>  [557] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cde8ob2t6nvdz"           
#>  [558] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdh5wf8c401j3"           
#>  [559] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdhkuscm4c6hk"           
#>  [560] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdmnmob7etbar"           
#>  [561] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdokc4x10q66c"           
#>  [562] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdwxczzrvwe0c"           
#>  [563] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cdyfc0ev4q5ik"           
#>  [564] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ce5crujmw4rdv"           
#>  [565] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ce66vzshwlojk"           
#>  [566] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ce7fmdzqdb40n"           
#>  [567] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cecmzbk8fsean"           
#>  [568] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ceopyodipbou5"           
#>  [569] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cetyly1ylgad9"           
#>  [570] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cezn2rn3rzgbq"           
#>  [571] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cf3wk8665quv9"           
#>  [572] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cf5bw3qeejmu8"           
#>  [573] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cf88178gv08bv"           
#>  [574] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cf8xvz65sy8a1"           
#>  [575] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cfpodz6rzg8qd"           
#>  [576] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cfxfbhg19isnn"           
#>  [577] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cg43mgdsa4wsj"           
#>  [578] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cgb1xzssrj9f0"           
#>  [579] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cgfjmf92yy4l6"           
#>  [580] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cggu6ut6pyo6u"           
#>  [581] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cgkn4nz0ijso0"           
#>  [582] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cgpntws5957ug"           
#>  [583] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cgza4aoc7in58"           
#>  [584] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ch2z2jp8vm6ln"           
#>  [585] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ch3cmn6iw023e"           
#>  [586] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ch69pr4z5f7pp"           
#>  [587] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ch8m5s9dlgh2e"           
#>  [588] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chczzocj6zah4"           
#>  [589] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cheops6yfg1rz"           
#>  [590] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chksmwpbdtrkx"           
#>  [591] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chniobzy7augt"           
#>  [592] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chq78y7c1cfq6"           
#>  [593] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chuqwlfa6gzya"           
#>  [594] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chuw5dfueh2jy"           
#>  [595] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/chv04w2lykr4d"           
#>  [596] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ci0516wowdo28"           
#>  [597] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ci889a92bz1x8"           
#>  [598] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ciaruyszrik5c"           
#>  [599] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ciiv61fm8a8go"           
#>  [600] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cijeanljx2jb3"           
#>  [601] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ciocne081zdmg"           
#>  [602] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cix2efjya7mlx"           
#>  [603] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cj4rhz7buc3kl"           
#>  [604] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cjbrre2ktez2g"           
#>  [605] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cjjojoplf17y7"           
#>  [606] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cjpszfvmh7y65"           
#>  [607] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cjxez35ypnwko"           
#>  [608] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ck0w436gizvm9"           
#>  [609] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ckdr7b39yj5n6"           
#>  [610] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ckk8lutowlfa4"           
#>  [611] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cko9ruqgxbt3d"           
#>  [612] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ckrbd7gi86zwd"           
#>  [613] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cl845dty6qeki"           
#>  [614] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cla8yi64hrzhf"           
#>  [615] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/clcp7dom535az"           
#>  [616] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/clha4mm385u30"           
#>  [617] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cln1zhjm8nra8"           
#>  [618] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/clvexqtodrf3j"           
#>  [619] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cly6m8wlm92eh"           
#>  [620] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/clzgpqtba8iyh"           
#>  [621] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cm7mx15igj0a3"           
#>  [622] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmaew00utesip"           
#>  [623] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmbabkbsq2tka"           
#>  [624] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmea5xhd6moip"           
#>  [625] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmflcou5zzbl8"           
#>  [626] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmmdsvg6a8eii"           
#>  [627] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmr8r0l8rqciz"           
#>  [628] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmro9pa22hcyl"           
#>  [629] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cmwim43f0q6p5"           
#>  [630] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cn0hk3qldys2g"           
#>  [631] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cn3kudy4u012p"           
#>  [632] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cn5f0otjmy8mo"           
#>  [633] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cn5sdb029ku4s"           
#>  [634] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cnmagpwwhgzbp"           
#>  [635] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cnsmwqs5i5bjh"           
#>  [636] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cnv7i9imu3ozm"           
#>  [637] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cocch88dh9vta"           
#>  [638] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cofz1z6guclsw"           
#>  [639] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/coi162ruhexfb"           
#>  [640] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/conr2w5agqb80"           
#>  [641] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cop8tmdnf24y9"           
#>  [642] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/coxvnccm1ipxg"           
#>  [643] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cp0vrtpaqjx4a"           
#>  [644] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cp29cz2fyrwng"           
#>  [645] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cpdzn9wqqo9je"           
#>  [646] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cpjilhc0w1uj7"           
#>  [647] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cpr3hvefktetp"           
#>  [648] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cprio2unoopma"           
#>  [649] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cq8gd0h12zwr9"           
#>  [650] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cqdj054lbv4pm"           
#>  [651] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cqhlaj8yqbfek"           
#>  [652] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cqlxqtr6m5wtc"           
#>  [653] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cqo2n5vboqe4b"           
#>  [654] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cqyfmu85y7iju"           
#>  [655] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cr61x2ff9po1l"           
#>  [656] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cr6jprgw32683"           
#>  [657] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/crkaeg7imdm5w"           
#>  [658] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/crvsn4vq8f90x"           
#>  [659] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cs4hgd7msq9e3"           
#>  [660] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cscfeytpz3c3u"           
#>  [661] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/csj8m9yq8o2dc"           
#>  [662] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/csmuop1x7nbn6"           
#>  [663] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/css4fay5r2aqa"           
#>  [664] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cswl096mppjwa"           
#>  [665] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cszhlu4uj0s2v"           
#>  [666] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ct8809eqxc7l4"           
#>  [667] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ctc1cs49q1xsy"           
#>  [668] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ctdxoca21183s"           
#>  [669] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/ctp6m8o5vp8vh"           
#>  [670] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cttbg3yht2lgc"           
#>  [671] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cu53ra4q0yoq8"           
#>  [672] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cu81fx4sm3sl2"           
#>  [673] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cueafrnl0cfb8"           
#>  [674] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cv1a4mdjk95b1"           
#>  [675] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cv240xn1plil9"           
#>  [676] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cvd458vh2kolu"           
#>  [677] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cvn05f8kpcyxa"           
#>  [678] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cvn1bc08570p5"           
#>  [679] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cvs5xwrh5thnl"           
#>  [680] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cvv0q5xvrtesk"           
#>  [681] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cwq52l9tqq48v"           
#>  [682] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cwrcujlhatzlv"           
#>  [683] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cx33y95xiclbg"           
#>  [684] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cx7njz241y632"           
#>  [685] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cxaugavzryqc1"           
#>  [686] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cxd793bj0tlp3"           
#>  [687] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cxkw8yhlnnx5d"           
#>  [688] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cybtemvftpzv5"           
#>  [689] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cyjytzqspoti8"           
#>  [690] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cylpd1gp0siel"           
#>  [691] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cyozlny085vqm"           
#>  [692] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cywak3av7rh9w"           
#>  [693] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cz65iepwph9ka"           
#>  [694] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cz6bq6zbxoq43"           
#>  [695] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/cz8g2i2mcmvun"           
#>  [696] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czo5at7kng1wr"           
#>  [697] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czxebv48oxw14"           
#>  [698] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czy30fufbfovc"           
#>  [699] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czysbdxh86kk9"           
#>  [700] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czyzmsvbjr723"           
#>  [701] "./.Rproj.user/shared/notebooks/387D5A8E-07-Data-Cleaning-1-Gating-Data/1/s/czzua3rfzk13g"           
#>  [702] "./.Rproj.user/shared/notebooks/4CEBFE11-05-Data-Import"                                             
#>  [703] "./.Rproj.user/shared/notebooks/4CEBFE11-05-Data-Import/1"                                           
#>  [704] "./.Rproj.user/shared/notebooks/4CEBFE11-05-Data-Import/1/5D1DEEE4628d3670"                          
#>  [705] "./.Rproj.user/shared/notebooks/4CEBFE11-05-Data-Import/1/s"                                         
#>  [706] "./.Rproj.user/shared/notebooks/5B566C2A-index"                                                      
#>  [707] "./.Rproj.user/shared/notebooks/5B566C2A-index/1"                                                    
#>  [708] "./.Rproj.user/shared/notebooks/5B566C2A-index/1/5D1DEEE41778adb6"                                   
#>  [709] "./.Rproj.user/shared/notebooks/5B566C2A-index/1/5D1DEEE4b211018f"                                   
#>  [710] "./.Rproj.user/shared/notebooks/5B566C2A-index/1/5D1DEEE4e83b9473"                                   
#>  [711] "./.Rproj.user/shared/notebooks/5B566C2A-index/1/s"                                                  
#>  [712] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages"                                                
#>  [713] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1"                                              
#>  [714] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/5D1DEEE43cee7c50"                             
#>  [715] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/5D1DEEE4628d3670"                             
#>  [716] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/5D1DEEE47ed02fb7"                             
#>  [717] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/5D1DEEE4e09923c"                              
#>  [718] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/s"                                            
#>  [719] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/s/c9eg90q0uurg1"                              
#>  [720] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/s/c9eg90q0uurg1_t"                            
#>  [721] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/s/ccq578ud8lvvx"                              
#>  [722] "./.Rproj.user/shared/notebooks/73A4DF29-03-Packages/1/s/cv8aqpqucc66h"                              
#>  [723] "./.Rproj.user/shared/notebooks/7A83E00D-08-Data-Cleaning-3-Acquisition-Anomalies"                   
#>  [724] "./.Rproj.user/shared/notebooks/7A83E00D-08-Data-Cleaning-3-Acquisition-Anomalies/1"                 
#>  [725] "./.Rproj.user/shared/notebooks/7A83E00D-08-Data-Cleaning-3-Acquisition-Anomalies/1/5D1DEEE41778adb6"
#>  [726] "./.Rproj.user/shared/notebooks/7A83E00D-08-Data-Cleaning-3-Acquisition-Anomalies/1/5D1DEEE4b211018f"
#>  [727] "./.Rproj.user/shared/notebooks/7A83E00D-08-Data-Cleaning-3-Acquisition-Anomalies/1/s"               
#>  [728] "./.Rproj.user/shared/notebooks/7F9C08B3-09-Data-Transformation"                                     
#>  [729] "./.Rproj.user/shared/notebooks/7F9C08B3-09-Data-Transformation/1"                                   
#>  [730] "./.Rproj.user/shared/notebooks/7F9C08B3-09-Data-Transformation/1/5D1DEEE4d2175271"                  
#>  [731] "./.Rproj.user/shared/notebooks/7F9C08B3-09-Data-Transformation/1/s"                                 
#>  [732] "./.Rproj.user/shared/notebooks/96887F79-04-File-Management"                                         
#>  [733] "./.Rproj.user/shared/notebooks/96887F79-04-File-Management/1"                                       
#>  [734] "./.Rproj.user/shared/notebooks/96887F79-04-File-Management/1/5D1DEEE4628d3670"                      
#>  [735] "./.Rproj.user/shared/notebooks/96887F79-04-File-Management/1/s"                                     
#>  [736] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling"                                            
#>  [737] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1"                                          
#>  [738] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/5D1DEEE486f249e3"                         
#>  [739] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s"                                        
#>  [740] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/c0lwjrinp7xn8"                          
#>  [741] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/c2qesphqv4zar"                          
#>  [742] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/ca8b22mcj0l5s"                          
#>  [743] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/cnm12m1726kc5"                          
#>  [744] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/cqazc623czd3r"                          
#>  [745] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/cswbi7b8qtzl5"                          
#>  [746] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/cuhvk37a5bmsg"                          
#>  [747] "./.Rproj.user/shared/notebooks/AD2E42F7-10-Downsampling/1/s/cyiz3iqihl39h"                          
#>  [748] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import"                                             
#>  [749] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1"                                           
#>  [750] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/5D1DEEE44e70cfb6"                          
#>  [751] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/5D1DEEE4ffcce124"                          
#>  [752] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s"                                         
#>  [753] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c0p6vs9nd8h44"                           
#>  [754] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c1kpgjlkv3ozs"                           
#>  [755] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c1txnqrjzu1ck"                           
#>  [756] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c2htzecsko1dw"                           
#>  [757] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c36oo6ngkll2v"                           
#>  [758] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c3o4g4ziq0760"                           
#>  [759] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c3sw99g6yvr57"                           
#>  [760] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c4ewto267sov2"                           
#>  [761] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c4n02vhmf5nso"                           
#>  [762] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c666lu82q1vnk"                           
#>  [763] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c6ay2przp9g2t"                           
#>  [764] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c6cowmoeyfqiu"                           
#>  [765] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c6skkdy3oogc9"                           
#>  [766] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c7f7g0iunafzn"                           
#>  [767] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c7rc382g0z4yb"                           
#>  [768] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c7vavp6dadzrv"                           
#>  [769] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c9dd8wclpfgr4"                           
#>  [770] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c9imwvqguidxf"                           
#>  [771] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/c9tpghthicjj0"                           
#>  [772] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cbbimb48lrgaf"                           
#>  [773] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cbmowcso22ps8"                           
#>  [774] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cbtwjp6ayy7a5"                           
#>  [775] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/ccfmnppp8anm3"                           
#>  [776] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cd5wptn50ybqi"                           
#>  [777] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/ce708wmnnxr1l"                           
#>  [778] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cekxmanv0nb8p"                           
#>  [779] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cep3qevh23s23"                           
#>  [780] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cf94nx2cw10ul"                           
#>  [781] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cfroe6sn3imse"                           
#>  [782] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cfyep7z6hv7os"                           
#>  [783] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cgkvxnxphdmuw"                           
#>  [784] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cgtlrbn58p8cm"                           
#>  [785] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cgv1rcsfewm0m"                           
#>  [786] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/chikfw9nvsfd4"                           
#>  [787] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cioqwsrzmwkkm"                           
#>  [788] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cj4admlxbfo1r"                           
#>  [789] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cjh8zb1bpqg73"                           
#>  [790] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cjxa9ixt1ohl5"                           
#>  [791] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/ckaz0in08oh4e"                           
#>  [792] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/clipqag1hfnw4"                           
#>  [793] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cmrwmskzyquhf"                           
#>  [794] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cnkmuezcc6rk1"                           
#>  [795] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cnrnc1pdzrewq"                           
#>  [796] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cny9j3b84sxs3"                           
#>  [797] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/co132ish21ghl"                           
#>  [798] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/co2u12moqhy56"                           
#>  [799] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cost5h6gehxfv"                           
#>  [800] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cp8brbhzd31n3"                           
#>  [801] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cpq3oj18kyzve"                           
#>  [802] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cq2wriy1nnskv"                           
#>  [803] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cq9i2pq1y54lq"                           
#>  [804] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/crpdtpe8sgsrj"                           
#>  [805] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cs7xz3poe5z0b"                           
#>  [806] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cs9m2api6qeev"                           
#>  [807] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/csawdsysr172b"                           
#>  [808] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/csntnch00hbxl"                           
#>  [809] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/csu6hpky0utse"                           
#>  [810] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cttbrjfpbu6yz"                           
#>  [811] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/ctteratz2pjak"                           
#>  [812] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cuyomwigtfi9t"                           
#>  [813] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cuz4i03ildis3"                           
#>  [814] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cv69z4uhz3l0g"                           
#>  [815] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cv8lmf1gvzwly"                           
#>  [816] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cva3iuluhx1aq"                           
#>  [817] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cvj5q81q3o8xd"                           
#>  [818] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cvvjs3qm5fm2p"                           
#>  [819] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cw2qhp53fhldo"                           
#>  [820] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cw3zg3ky2inkc"                           
#>  [821] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cwlftkt493pn9"                           
#>  [822] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cxj16757wsu06"                           
#>  [823] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cxoui1pxrp6zf"                           
#>  [824] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cxuw319ph8ic9"                           
#>  [825] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cy87oeqm3l4rq"                           
#>  [826] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/cyz7vy1p1xpay"                           
#>  [827] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/czie8dzi9essa"                           
#>  [828] "./.Rproj.user/shared/notebooks/BD00D605-05-Data-Import/1/s/czzu31xernqc3"                           
#>  [829] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies"                   
#>  [830] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1"                 
#>  [831] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/5D1DEEE4b3d301be"
#>  [832] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s"               
#>  [833] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c0rm61f70w6ii" 
#>  [834] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c0v3545eg6fmq" 
#>  [835] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c2gdm1l6nug3i" 
#>  [836] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c339wqjbw7hsa" 
#>  [837] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c3d0zbjv2i767" 
#>  [838] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c689vvat77c2q" 
#>  [839] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c6byhiob8sqd1" 
#>  [840] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/c9lphzqegrmhr" 
#>  [841] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cbl8ux1yrfv4l" 
#>  [842] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cbm2frv5xqqks" 
#>  [843] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/ccyto7lfxvdif" 
#>  [844] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cdtk1pwq8gyxn" 
#>  [845] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/ceb20kmlbzah9" 
#>  [846] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/ced9v3el5b4im" 
#>  [847] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cftj8law37ks1" 
#>  [848] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/chgv8bfe75kme" 
#>  [849] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/clipk6prx45gm" 
#>  [850] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cmcroalbfvj7x" 
#>  [851] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cmnzax2jt34h4" 
#>  [852] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cnchav0aep9b1" 
#>  [853] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cnoxt67zflj1v" 
#>  [854] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/coujcpfy1t8oz" 
#>  [855] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cpj4u3e2vd225" 
#>  [856] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cqkq7qlabwaos" 
#>  [857] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cqq8ryx85f621" 
#>  [858] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/crl9iooc4gprb" 
#>  [859] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/csowfbcp323jr" 
#>  [860] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/csvfnm0dj8pyh" 
#>  [861] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/cwejuvfpa12nr" 
#>  [862] "./.Rproj.user/shared/notebooks/D0FBD3F9-09-Data-Cleaning-3-Acquisition-Anomalies/1/s/czd0ktq0gah44" 
#>  [863] "./.Rproj.user/shared/notebooks/D6B1E55A-01-Introduction"                                            
#>  [864] "./.Rproj.user/shared/notebooks/D6B1E55A-01-Introduction/1"                                          
#>  [865] "./.Rproj.user/shared/notebooks/D6B1E55A-01-Introduction/1/5D1DEEE4b211018f"                         
#>  [866] "./.Rproj.user/shared/notebooks/D6B1E55A-01-Introduction/1/5D1DEEE4d2175271"                         
#>  [867] "./.Rproj.user/shared/notebooks/D6B1E55A-01-Introduction/1/s"                                        
#>  [868] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation"                                      
#>  [869] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1"                                    
#>  [870] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/5D1DEEE4628d3670"                   
#>  [871] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/5D1DEEE47ed02fb7"                   
#>  [872] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/s"                                  
#>  [873] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/s/c1l7c1et4sfeb"                    
#>  [874] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/s/c82pzixng2x69"                    
#>  [875] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/s/covpki7mw9f0d"                    
#>  [876] "./.Rproj.user/shared/notebooks/D730AB1C-06-Data-Visualisation/1/s/cwatda7au7mtn"                    
#>  [877] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data"                                 
#>  [878] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1"                               
#>  [879] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/5D1DEEE42dd37c8b"              
#>  [880] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s"                             
#>  [881] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/c0qb43r1j6vhl"               
#>  [882] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/c23qmrgd37lnc"               
#>  [883] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/c4tvqp76ltgzh"               
#>  [884] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/c9o7fzscn76mt"               
#>  [885] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/cc5qlkz119nwi"               
#>  [886] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/cpvtn04ff1w7s"               
#>  [887] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/ctglfjgwaonit"               
#>  [888] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/cti0a2w7d5imw"               
#>  [889] "./.Rproj.user/shared/notebooks/E1F700BE-12-Extract-Expression-Data/1/s/cvd7mx5yjur1c"               
#>  [890] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering"                                              
#>  [891] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1"                                            
#>  [892] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s"                                          
#>  [893] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c1eo5nfm5cr3i"                            
#>  [894] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c26mbbyvb99sg"                            
#>  [895] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c2imiiv88aah3"                            
#>  [896] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c317nmyylf58i"                            
#>  [897] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c3hlyzc7aln8r"                            
#>  [898] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c3pq4vkwgk5xf"                            
#>  [899] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c3yfl3qnyczq7"                            
#>  [900] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c4n5lqhz8ccxt"                            
#>  [901] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c4z3mv9t7igfx"                            
#>  [902] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c7d1dhf5eh550"                            
#>  [903] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c7jpic4oh2j13"                            
#>  [904] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c8a6r8wuelit8"                            
#>  [905] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c8cwva279gep0"                            
#>  [906] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c8hol9z8cgr5v"                            
#>  [907] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/c9qxt860fkqzt"                            
#>  [908] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ca7ipm53ta99f"                            
#>  [909] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cau3bhq0xmdto"                            
#>  [910] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ccsqjsgm74dqo"                            
#>  [911] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ce3fgonrse2vm"                            
#>  [912] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cenuzz5f0wmh9"                            
#>  [913] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cfj4l5obrxiqo"                            
#>  [914] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cfp3vgbsejzin"                            
#>  [915] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cgvq6wlyvm88e"                            
#>  [916] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cgx97qsw05c5p"                            
#>  [917] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ch8tel3x5i3je"                            
#>  [918] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cixanmtgj640k"                            
#>  [919] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cly8gdva6guv2"                            
#>  [920] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cme602hi6ilvz"                            
#>  [921] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cn3eitbvkidmt"                            
#>  [922] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cn4ljwkzvygc6"                            
#>  [923] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cnc61w40ssx1c"                            
#>  [924] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cnj1y42qoaxbt"                            
#>  [925] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cop7zhpdio34i"                            
#>  [926] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cph6ib7etfucl"                            
#>  [927] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cs88jyckk8jxv"                            
#>  [928] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cszxegmp3izrw"                            
#>  [929] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ct29mozbiosem"                            
#>  [930] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/ct2op9wumgyj4"                            
#>  [931] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cuq47ugrpzrkv"                            
#>  [932] "./.Rproj.user/shared/notebooks/EAF63657-15-Clustering/1/s/cyc34eg241uvz"                            
#>  [933] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures"                      
#>  [934] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1"                    
#>  [935] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s"                  
#>  [936] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/c50dyyebg367r"    
#>  [937] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/c8lf8gl2ptfxj"    
#>  [938] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cbql4aqx1g2dl"    
#>  [939] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cbvr3c0f7olwp"    
#>  [940] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/ccl9yv4gby449"    
#>  [941] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/ce9mhkm56t524"    
#>  [942] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cgg0m8lk1xcvo"    
#>  [943] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cgh00uyb977b7"    
#>  [944] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/chwzppgktjs93"    
#>  [945] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/ckz1quw7l0efi"    
#>  [946] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cpw733kzw4vsw"    
#>  [947] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cr5jzaarshykv"    
#>  [948] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cvjqdgfd0l3rx"    
#>  [949] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cwgtt0t3ty3tn"    
#>  [950] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cwzzmsvu4rkd2"    
#>  [951] "./.Rproj.user/shared/notebooks/ECCD89C5-16-Statistics-and-Publication-Figures/1/s/cyhisnthgd7hh"    
#>  [952] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data"                             
#>  [953] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1"                           
#>  [954] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/5D1DEEE4e09923c"           
#>  [955] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/5D1DEEE4e83b9473"          
#>  [956] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s"                         
#>  [957] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/c0bygcof0xh1e"           
#>  [958] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/c0o5zku4qcdjw"           
#>  [959] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/c1613zgxv51z4"           
#>  [960] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/c67c3eucl4d0c"           
#>  [961] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/caazu94nc9hy9"           
#>  [962] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/cb67imenerr1v"           
#>  [963] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/cdio6yn2tifqz"           
#>  [964] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/chdmoimhp8me7"           
#>  [965] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/ck7n1j7t7pld8"           
#>  [966] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/cnorzv94usi7f"           
#>  [967] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/cq4vro5erfdqc"           
#>  [968] "./.Rproj.user/shared/notebooks/EE0C34BE-06-Data-Cleaning-1-Gating-Data/1/s/cs9csohbiem18"           
#>  [969] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup"                                     
#>  [970] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1"                                   
#>  [971] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/5D1DEEE4628d3670"                  
#>  [972] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/5D1DEEE4d2175271"                  
#>  [973] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/5D1DEEE4e09923c"                   
#>  [974] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/s"                                 
#>  [975] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/s/c9pit713f073d"                   
#>  [976] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/s/canl0rcvqhmno"                   
#>  [977] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/s/chp5x4oahgyir"                   
#>  [978] "./.Rproj.user/shared/notebooks/F0E5833B-02-R-Environment-setup/1/s/cxt5qxxfevpil"                   
#>  [979] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation"                                      
#>  [980] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1"                                    
#>  [981] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s"                                  
#>  [982] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c0c6rvrg0d0ps"                    
#>  [983] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c0dpsr90jv1l3"                    
#>  [984] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c13r1i9zqusz5"                    
#>  [985] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c2lmpjtvdobca"                    
#>  [986] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c2tz5hmlccym6"                    
#>  [987] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c527m07hc6xmw"                    
#>  [988] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c55ygvj0tbtll"                    
#>  [989] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c5p9j6vtato8j"                    
#>  [990] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c6o1mkbtsda1v"                    
#>  [991] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c7jidba95j5m7"                    
#>  [992] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/c8nlzuw321e1w"                    
#>  [993] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/ca6bynkudw6tz"                    
#>  [994] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cb2igh2tt0hjn"                    
#>  [995] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cc98ystxt17fs"                    
#>  [996] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cdk7kmsbhwo7h"                    
#>  [997] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cek7axrqmrjnw"                    
#>  [998] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/celfn8vykbzce"                    
#>  [999] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cfc3ori7bqugu"                    
#> [1000] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cgc1hii84bk1o"                    
#> [1001] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cgw7hgfduqq43"                    
#> [1002] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/ch7ma2747hhsq"                    
#> [1003] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjee6yoe2gd5g"                    
#> [1004] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjo74mylamg45"                    
#> [1005] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjvfpsn06vpoz"                    
#> [1006] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjvoqehlihlpb"                    
#> [1007] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjy8b4ker58mx"                    
#> [1008] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cjzwqea7wg5cm"                    
#> [1009] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/ckva44v1rnwli"                    
#> [1010] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cl2uydejsk4as"                    
#> [1011] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/clablb0buju6f"                    
#> [1012] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/clsmuk3di307j"                    
#> [1013] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cmojafegkdz9o"                    
#> [1014] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cmoq3erulho9q"                    
#> [1015] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cn14s4c08uilh"                    
#> [1016] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cni9g2rxckj20"                    
#> [1017] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cos94px6mwe41"                    
#> [1018] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cpc4yntv1uhq8"                    
#> [1019] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cpx51wqjm9h23"                    
#> [1020] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cq9xfktzvbeyp"                    
#> [1021] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/crayjajdg6j9e"                    
#> [1022] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/crcty50p6xbj9"                    
#> [1023] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cs85l7tsmrwgu"                    
#> [1024] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/csb801oij0aps"                    
#> [1025] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/csrghp4c1n384"                    
#> [1026] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cu0owtezrh7h9"                    
#> [1027] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cv8d5ajc5bhw6"                    
#> [1028] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/cw4n6mdfu7rnb"                    
#> [1029] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/czb33uwbn2ayn"                    
#> [1030] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/czfmfaxble978"                    
#> [1031] "./.Rproj.user/shared/notebooks/FE2F92EC-06-Data-Visualisation/1/s/czwwrzw13y05o"                    
#> [1032] "./06-Data-Visualisation_files"                                                                      
#> [1033] "./06-Data-Visualisation_files/figure-html"                                                          
#> [1034] "./07-Data-Cleaning-1-Gating-Data_files"                                                             
#> [1035] "./07-Data-Cleaning-1-Gating-Data_files/figure-html"                                                 
#> [1036] "./08-Data-Cleaning-2-Channel-Names_files"                                                           
#> [1037] "./08-Data-Cleaning-2-Channel-Names_files/figure-html"                                               
#> [1038] "./09-Data-Cleaning-3-Acquisition-Anomalies_files"                                                   
#> [1039] "./09-Data-Cleaning-3-Acquisition-Anomalies_files/figure-html"                                       
#> [1040] "./10-Downsampling_files"                                                                            
#> [1041] "./10-Downsampling_files/figure-html"                                                                
#> [1042] "./11-Data-Transformation_files"                                                                     
#> [1043] "./11-Data-Transformation_files/figure-html"                                                         
#> [1044] "./12-Extract-Expression-Data_files"                                                                 
#> [1045] "./12-Extract-Expression-Data_files/figure-html"                                                     
#> [1046] "./13-Data-Visualisation-Full_files"                                                                 
#> [1047] "./13-Data-Visualisation-Full_files/figure-html"                                                     
#> [1048] "./14-Dimensionality-Reduction_files"                                                                
#> [1049] "./14-Dimensionality-Reduction_files/figure-html"                                                    
#> [1050] "./15-Clustering_files"                                                                              
#> [1051] "./15-Clustering_files/figure-html"                                                                  
#> [1052] "./16-Statistics-and-Publication-Figures_files"                                                      
#> [1053] "./16-Statistics-and-Publication-Figures_files/figure-html"                                          
#> [1054] "./anonymous"                                                                                        
#> [1055] "./Data"                                                                                             
#> [1056] "./Data/fcs"                                                                                         
#> [1057] "./Data/fcs/3_fcs-files_Live Singlets_R-Gated"                                                       
#> [1058] "./Data/fcs/pruned"                                                                                  
#> [1059] "./Data/other"                                                                                       
#> [1060] "./Data/RDS"                                                                                         
#> [1061] "./Data/renamed"                                                                                     
#> [1062] "./Data/ungated"                                                                                     
#> [1063] "./Draft Chapters"                                                                                   
#> [1064] "./figure"                                                                                           
#> [1065] "./Figures"                                                                                          
#> [1066] "./Images"                                                                                           
#> [1067] "./Outputs"                                                                                          
#> [1068] "./Outputs/FlowAI_QC"                                                                                
#> [1069] "./Outputs/flowCut"                                                                                  
#> [1070] "./Outputs/flowCut_AlwaysClean"                                                                      
#> [1071] "./Outputs/PeacoQC"                                                                                  
#> [1072] "./Outputs/PeacoQC/PeacoQC_results"                                                                  
#> [1073] "./Outputs/PeacoQC/PeacoQC_results/PeacoQC_plots"                                                    
#> [1074] "./Scratch"                                                                                          
#> [1075] "./Scripts"                                                                                          
#> [1076] "./Scripts/backup"                                                                                   
#> [1077] "./snippets"                                                                                         
#> [1078] "./Tables"
```

**List files in current location:**

``` r
list.files()
#>  [1] "_book"                                           
#>  [2] "_bookdown_files"                                 
#>  [3] "_bookdown.yml"                                   
#>  [4] "_common.R"                                       
#>  [5] "_output.yml"                                     
#>  [6] "01-Introduction.md"                              
#>  [7] "01-Introduction.Rmd"                             
#>  [8] "02-R-Environment-setup.md"                       
#>  [9] "02-R-Environment-setup.Rmd"                      
#> [10] "03-Packages.md"                                  
#> [11] "03-Packages.Rmd"                                 
#> [12] "04-File-Management.Rmd"                          
#> [13] "05-Data-Import.Rmd"                              
#> [14] "06-Data-Visualisation_files"                     
#> [15] "06-Data-Visualisation.Rmd"                       
#> [16] "07-Data-Cleaning-1-Gating-Data_files"            
#> [17] "07-Data-Cleaning-1-Gating-Data.Rmd"              
#> [18] "08-Data-Cleaning-2-Channel-Names_files"          
#> [19] "08-Data-Cleaning-2-Channel-Names.Rmd"            
#> [20] "09-Data-Cleaning-3-Acquisition-Anomalies_files"  
#> [21] "09-Data-Cleaning-3-Acquisition-Anomalies.Rmd"    
#> [22] "10-Downsampling_files"                           
#> [23] "10-Downsampling.Rmd"                             
#> [24] "11-Data-Transformation_files"                    
#> [25] "11-Data-Transformation.Rmd"                      
#> [26] "12-Extract-Expression-Data_files"                
#> [27] "12-Extract-Expression-Data.Rmd"                  
#> [28] "13-Data-Visualisation-Full_files"                
#> [29] "13-Data-Visualisation-Full.Rmd"                  
#> [30] "14-Dimensionality-Reduction_files"               
#> [31] "14-Dimensionality-Reduction.Rmd"                 
#> [32] "15-Clustering_files"                             
#> [33] "15-Clustering.Rmd"                               
#> [34] "16-Statistics-and-Publication-Figures_files"     
#> [35] "16-Statistics-and-Publication-Figures.Rmd"       
#> [36] "2026-08-19 Alpha testers email.md"               
#> [37] "Analysing-Cytometry-Data-with-R.rds"             
#> [38] "Analysing-Cytometry-Data-With-R.Rproj"           
#> [39] "anonymous"                                       
#> [40] "book.bib"                                        
#> [41] "chicago-fullnote-bibliography.csl"               
#> [42] "Data"                                            
#> [43] "Draft Chapters"                                  
#> [44] "figure"                                          
#> [45] "Figures"                                         
#> [46] "Finish_The_Course_Checklist.md"                  
#> [47] "Images"                                          
#> [48] "index.md"                                        
#> [49] "index.Rmd"                                       
#> [50] "LICENSE"                                         
#> [51] "Log Transform Testing.R"                         
#> [52] "NxN Plotting.R"                                  
#> [53] "Open_Issues.md"                                  
#> [54] "Outputs"                                         
#> [55] "packages.bib"                                    
#> [56] "preamble.tex"                                    
#> [57] "R_Course_PROJECT.md"                             
#> [58] "README.md"                                       
#> [59] "Reference_immun0_live_site.md"                   
#> [60] "Reference_Real_Working_Script_Helios4-2.Rmd"     
#> [61] "Reference_Real_Working_Script_VIP_Study_Salman.R"
#> [62] "render11f9a130b09ba.rds"                         
#> [63] "Rplots.pdf"                                      
#> [64] "Scratch"                                         
#> [65] "Scripts"                                         
#> [66] "snippets"                                        
#> [67] "style.css"                                       
#> [68] "Tables"
```

**List only FCS files in a specific folder:**

``` r
list.files(here("Data", "fcs"), pattern = ".fcs$")
#> [1] "2PFANASPermLIVE.fcs"      "4PFA1GLUTNASPermLIVE.fcs"
#> [3] "4PFANASPermLIVE.fcs"      "4PFANoPermLIVE.fcs"      
#> [5] "8PFANASPermLIVE.fcs"
```

The `pattern` argument uses a "regular expression," a pattern matching system. `.fcs$` means "files ending in .fcs".

### Verifying Your Setup

At this point, you should be able to:

1. Open your `.Rproj` file and see RStudio start in your project
2. Run `here()` and see your project path
3. Run `list.files(here("Data", "fcs"))` and see 5 FCS files
4. Confirm `Data/RDS/` exists (it will be empty until Chapter 5, unless you've already extracted our provided starter RDS files into it)
5. Confirm `Scripts/`, `Figures/`, `Tables/`, and `Outputs/` all exist (`Figures/`, `Tables/` and `Outputs/` are empty for now)

If any of these checks fail, review the setup steps above.

### Troubleshooting

**Problem:** `here()` shows the wrong location
**Solution:** Make sure you opened RStudio via the `.Rproj` file, not just opening RStudio directly

**Problem:** `list.files()` shows nothing
**Solution:** Check that you extracted the ZIP file to the correct location and that the folder name matches exactly (`fcs`, not `FCS` or `Fcs`)

**Problem:** Files are in the wrong folders
**Solution:** Manually move them using your file explorer to match the expected structure

**Problem:** Path uses backslashes
**Solution:** R automatically converts backslashes to forward slashes internally, this is normal

### What's Next

With your project organised and data verified, the next chapter will load cytometry files into R and introduce the data structures we'll use throughout the course.

The file organisation you've created will support all subsequent analyses without requiring any path modifications.
