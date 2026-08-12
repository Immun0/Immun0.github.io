# Chapter 5 - Loading Cytometry Data

## What You'll Learn

This chapter introduces how R stores and organises cytometry data. You'll load your first FCS files and learn to examine what's inside them. By the end, you'll understand the basic data structures that all subsequent analysis depends on.

## Understanding FCS Files

Before loading data into R, let's understand what we're working with.

**FCS (Flow Cytometry Standard) files** are the universal format for cytometry data. They contain:
- Expression values for each cell and each marker
- Metadata about how the sample was acquired
- Channel information and compensation matrices
- Instrument settings and keywords

Think of an FCS file as a spreadsheet where:
- Each row is one cell (or "event")
- Each column is one marker or measurement
- Additional information is stored as file properties

### Where This Course's Data Came From

Mass cytometers (e.g. the Helios) don't output FCS directly, their raw output is an `.IMD` file, the same format other mass spectrometers use. Someone, usually the core facility that ran your samples, converts that into the `.fcs` format this course and every other cytometry analysis tool expects.

You'll also see the word "debarcoded" used throughout this course to describe the provided data. Debarcoding is what separates out multiplexed samples: rather than running each sample through the cytometer separately, several samples are tagged with a unique combination of barcodes and run together in one tube, reducing batch effects from pipetting or titration differences between separate runs. Debarcoding is the step afterward that sorts events back out into one FCS file per original sample. This is usually done for you by whoever exported the data (as it was for this course's dataset), but self-service debarcoding tools exist too, e.g. the Nolan lab's [single-cell debarcoder](https://github.com/nolanlab/single-cell-debarcoder), if you need to redo it yourself or reprocess the original acquisition.

## The Essentials {.essentials}

### Step 1: Load Required Packages


``` r
library(flowCore)
library(here)
#> Warning in readLines(f, n): line 1 appears to contain an
#> embedded nul
#> here() starts at /Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R
```

**What these do:**
- `flowCore`: Specialized package for reading and working with cytometry data
- `here`: Manages file paths (we set this up in Chapter 4)

### Step 2: Load the Course Dataset


``` r
FLOWSET <- read.flowSet(path = here("Data", "fcs"), pattern = "\\.fcs$") # The "pattern ="\\.fcs" command ensures that the data import can take place even if there are other irrelevant files and folders present. If you don't use this ad there is an unexpected folder or file, you'lkl get an error.
```

**What this does:** Reads all FCS files from the `fcs` folder and stores the result under the name `FLOWSET`.

In R, an **object** is a reserved location in memory that stores data, a data structure, or even code. R is a functional, object-oriented language, which means everything that exists in R is an object: a single number, a table, a plot, even a function itself. When you ran the line above, R reserved memory for your loaded FCS data and gave it the name `FLOWSET`, so you created an object.

You can see this happen: look at the Environment pane in the top-right of RStudio, the one Chapter 2 pointed out. `FLOWSET` now appears there, one entry in a list of every object that currently exists in your session.

This particular object is of a special type called a "flowSet", the next section explains what that means.

This data has already been normalised, debarcoded, and gated to live singlets, we don't ship every intermediate processing stage, just the data you'll actually work with.

### Step 3: Verify the Data Loaded

Check how many files were loaded:


``` r
length(FLOWSET)
#> [1] 5
```

**Success looks like this:**
```
[1] 5
```

Check the file names:


``` r
sampleNames(FLOWSET)
#> [1] "2PFANASPermLIVE.fcs"      "4PFA1GLUTNASPermLIVE.fcs"
#> [3] "4PFANASPermLIVE.fcs"      "4PFANoPermLIVE.fcs"      
#> [5] "8PFANASPermLIVE.fcs"
```

**Success looks like this:**
```
[1] "2PFANASPermLIVE.fcs" "4PFA1GLUTNASPermLIVE.fcs" "4PFANASPermLIVE.fcs" "4PFANoPermLIVE.fcs" "8PFANASPermLIVE.fcs"
```

**Problem looks like this:**
```
Error in read.flowSet(path = here("Data", "fcs")) :
  path 'C:/Users/YourName/Documents/Cytometry_R_Course/Data/fcs' does not contain any valid FCS files
```
This means the FCS files aren't in `Data/fcs/`, or don't have the `.fcs` extension. Check Chapter 4's folder setup.

### Step 4: Examine What's Inside

Check which markers were measured:


``` r
colnames(FLOWSET)
#>  [1] "Time"         "Event_length" "Y89Di"       
#>  [4] "Pd102Di"      "Rh103Di"      "Pd104Di"     
#>  [7] "Pd105Di"      "Pd106Di"      "Pd108Di"     
#> [10] "Pd110Di"      "Sn120Di"      "I127Di"      
#> [13] "Xe131Di"      "Cs133Di"      "Ba138Di"     
#> [16] "Ce140Di"      "Pr141Di"      "Nd142Di"     
#> [19] "Nd143Di"      "Nd144Di"      "Nd145Di"     
#> [22] "Nd146Di"      "Sm147Di"      "Nd148Di"     
#> [25] "Sm149Di"      "Nd150Di"      "Eu151Di"     
#> [28] "Sm152Di"      "Eu153Di"      "Sm154Di"     
#> [31] "Gd155Di"      "Gd156Di"      "Gd158Di"     
#> [34] "Tb159Di"      "Gd160Di"      "Dy161Di"     
#> [37] "Dy162Di"      "Dy163Di"      "Dy164Di"     
#> [40] "Ho165Di"      "Er166Di"      "Er167Di"     
#> [43] "Er168Di"      "Tm169Di"      "Er170Di"     
#> [46] "Yb171Di"      "Yb172Di"      "Yb173Di"     
#> [49] "Yb174Di"      "Lu175Di"      "Yb176Di"     
#> [52] "BCKG190Di"    "Ir191Di"      "Ir193Di"     
#> [55] "Pt195Di"      "Pb208Di"      "Bi209Di"     
#> [58] "Center"       "Offset"       "Width"       
#> [61] "Residual"
```

This shows all the channels recorded in your files - both cell measurements (Time, Event_length) and markers (the metal isotope names).

Check the marker annotations:


``` r
markernames(FLOWSET)
#>         Event_length                Y89Di 
#>       "Event_length"           "89Y_CD41" 
#>              Pd102Di              Rh103Di 
#>      "102Pd_Barcode"       "103Rh_Unused" 
#>              Pd104Di              Pd105Di 
#>      "104Pd_Barcode"      "105Pd_Barcode" 
#>              Pd106Di              Pd108Di 
#>      "106Pd_Barcode"      "108Pd_Barcode" 
#>              Pd110Di              Sn120Di 
#>      "110Pd_Barcode"      "120Sn_Environ" 
#>               I127Di              Xe131Di 
#>           "127I_IdU"      "131Xe_Environ" 
#>              Cs133Di              Ba138Di 
#>      "133Cs_Environ"      "138Ba_Environ" 
#>              Ce140Di              Pr141Di 
#>    "140Ce_EQ4_beads"      "141Pr_CD235ab" 
#>              Nd142Di              Nd143Di 
#>     "142Nd_EMP-MAEA"       "143Nd_CD45RA" 
#>              Nd144Di              Nd145Di 
#>         "144Nd_FITC"       "145Nd_C-EBPa" 
#>              Nd146Di              Sm147Di 
#>       "146Nd_CD203c"         "147Sm_CD70" 
#>              Nd148Di              Sm149Di 
#>      "148Nd_ProMBP1"         "149Sm_CD34" 
#>              Nd150Di              Eu151Di 
#>        "150Nd_BACH1"        "151Eu_CD123" 
#>              Sm152Di              Eu153Di 
#>         "152Sm_MAFG"     "153Eu_CyclinB1" 
#>              Sm154Di              Gd155Di 
#>      "154Sm_NFE2p45"         "155Gd_CD36" 
#>              Gd156Di              Gd158Di 
#>           "156Gd_PE"        "158Gd_RUNX1" 
#>              Tb159Di              Gd160Di 
#> "159Tb_IKAROS-IKZF1"        "160Gd_CD105" 
#>              Dy161Di              Dy162Di 
#>         "161Dy_CD90"        "162Dy_Ki-67" 
#>              Dy163Di              Dy164Di 
#>        "163Dy_Gata2"        "164Dy_CD49F" 
#>              Ho165Di              Er166Di 
#>         "165Ho_Klf1"         "166Er_CD44" 
#>              Er167Di              Er168Di 
#>         "167Er_PU.1"         "168Er_CD71" 
#>              Tm169Di              Er170Di 
#>   "169Tm_FLI1_abcam"   "170Er_Globin_HBA" 
#>              Yb171Di              Yb172Di 
#>        "171Yb_Tbx15"         "172Yb_CD38" 
#>              Yb173Di              Yb174Di 
#>        "173Yb_CD184" "174Yb_HA.11_or_GFP" 
#>              Lu175Di              Yb176Di 
#>        "175Lu_CD135"        "176Yb_CD164" 
#>            BCKG190Di              Ir191Di 
#>            "190BCKG"         "191Ir_DNA1" 
#>              Ir193Di              Pt195Di 
#>         "193Ir_DNA2"    "195Pt_Live-Dead" 
#>              Pb208Di              Bi209Di 
#>      "208Pb_Environ"              "209Bi" 
#>               Center               Offset 
#>             "Center"             "Offset" 
#>                Width             Residual 
#>              "Width"           "Residual"
```

This shows which markers correspond to which channels. `NA` means no marker annotation (these are measurement channels).

### Step 5: Save Your Work

**Note:** Create the RDS folder first, if it doesn't already exist:

``` r
dir.create(here("Data", "RDS"), showWarnings = FALSE)
```


``` r
saveRDS(FLOWSET, here("Data", "RDS", "FLOWSET.rds"))
```

**What this does:** Saves the flowSet as an RDS file - R's native format for storing objects. This lets you reload the data instantly in future sessions without re-reading the FCS files.

`saveRDS()` doesn't print anything when it works, so check the file exists instead:


``` r
file.exists(here("Data", "RDS", "FLOWSET.rds"))
#> [1] TRUE
```

**Success looks like this:**
```
[1] TRUE
```

**Problem looks like this:**
```
[1] FALSE
```
If you see `FALSE`, the save didn't work, usually because `Data/RDS/` doesn't exist. Re-run the `dir.create()` line above, then re-run `saveRDS()`.

**Success check:** You should now have `FLOWSET.rds` in your `Data/RDS/` folder.

## A Deeper Dive {.deeper-dive}

### What is a flowSet?

A **flowSet** is R's way of organising multiple cytometry files together. Instead of working with files one at a time, a flowSet lets you:
- Apply the same analysis to all files at once
- Compare samples easily
- Keep related files organised

Think of a flowSet as a collection of samples from the same experiment.

### What is a flowFrame?

Each individual FCS file within a flowSet is called a **flowFrame**. A flowFrame contains:
- The expression data (cell-by-marker matrix)
- Parameter information (channel names, markers)
- Metadata (acquisition settings, keywords)

**Relationship:**
- One flowSet = multiple flowFrames
- One flowFrame = one FCS file

### The Direct Route: One File, No flowSet

The Essentials section above got you a flowFrame indirectly: read all 5 files into a flowSet with `read.flowSet()`, then pull one back out with `[[1]]`. That's the right approach for this course, since every later chapter works on all your samples together. But if you only ever have one file, or you're just exploring a single sample before deciding how to handle the rest, going through a flowSet first is unnecessary machinery. `flowCore` also lets you read one FCS file straight into a flowFrame:


``` r
FLOWFRAME <- read.FCS(here("Data", "fcs", "2PFANASPermLIVE.fcs"))
class(FLOWFRAME)
#> [1] "flowFrame"
#> attr(,"package")
#> [1] "flowCore"
```

`class(FLOWFRAME)` reports `"flowFrame"` directly, no flowSet ever existed in this version. Everything you'd do with `FLOWFRAME` from the Essentials section (`exprs()`, `markernames()`, `summary()`) works exactly the same way here, it's the same object type either way, just reached by a shorter path.

**Why this course uses `read.flowSet()`, not `read.FCS()`:** if you go looking at `flowCore`'s own documentation, `read.FCS()` is the more basic, foundational function, `read.flowSet()` actually calls `read.FCS()` once per file internally and bundles the results together. So here is why this course defaults to the flowSet route from Chapter 5 onward rather than reading files individually: every downstream chapter, cleaning, transformation, clustering, statistics, needs to treat all 5 samples the same way at once, and `fsApply()` (the function that does that) only works on a flowSet, not on individual flowFrames. Reading one file at a time with `read.FCS()` would mean repeating every step 5 times by hand instead of once.

### Understanding Data Structures

Both flowSets and flowFrames are **S4 objects** - a complex data structure type used by Bioconductor packages. Many basic structures in R can only hold one type of data throughout: a vector or a matrix has to be all numbers, or all text, never a mix. A data frame relaxes that a little, each column can be a different type, numbers in one, text in another, the same way an Excel sheet mixes numeric and text columns, but everything still has to fit one flat grid of rows and columns. An S4 object goes further still: it can hold pieces with genuinely different shapes side by side, not just different types within one grid. A flowFrame is a working example: it holds a matrix of cell-by-marker numbers, a separate table describing the channels and markers themselves, and a list of acquisition settings that isn't a table at all, just named values, all inside one `FLOWFRAME` object, each piece kept in whatever shape actually fits it.

You can recognise S4 objects by:
- The `@` symbol used to access their components (though you usually shouldn't use this directly)
- Special functions designed to work with them (`sampleNames()`, `colnames()`, `markernames()`)

Here's `@` in action, purely so you can recognise it when you see it:


``` r
FLOWFRAME@exprs
```

This reaches directly into the flowFrame's internal storage and pulls out its raw expression matrix, the same numbers `exprs()` gives you. `@` is doing for S4 objects roughly what `$` does for data frames, pulling out a named piece by name, but for a stricter, more rigidly defined object type. The reason you'll almost never write `FLOWFRAME@exprs` yourself is that `exprs(FLOWFRAME)` does the same job, safely, through a proper function, packages usually provide a named function for every piece you're meant to access, so you never actually need `@` yourself.

If you replace the expression data using `@` directly, R doesn't check whether the new data still makes sense with everything else in the object:


``` r
FLOWFRAME@exprs <- matrix(1:10, nrow = 2)  # wrong dimensions entirely, R accepts it anyway
```

Nothing errors here, even though this replacement almost certainly doesn't match the object's actual number of cells or channels. The object is now internally broken, but nothing tells you at that moment. The failure shows up later, somewhere else entirely, in a function that assumed the object made sense, and by then it's disconnected from the mistake that caused it.

The proper function checks first:


``` r
exprs(FLOWFRAME) <- matrix(1:10, nrow = 2)  # exprs() checks this against the object before allowing it
```

This would actually raise an error, because `exprs()` verifies the replacement fits before accepting it, `@` never does.

**Why this matters:** Understanding that cytometry data uses specialized structures helps you know which functions to use and how to troubleshoot problems.

### Three Ways to Get a Piece Out of an Object

You now have `FLOWSET`, one object holding all 5 of your files together. Very often you don't want the whole thing, you want just one file, or just a few files, or just one piece of information about it. R gives you three different tools for this, and they behave differently in ways that matter. Mixing them up is one of the most common beginner mistakes in R, so slow down here.

**Single brackets `[ ]`: take some files out, but keep them as a flowSet**


``` r
SUBSET <- FLOWSET[c(1, 3)]
class(SUBSET)
#> [1] "flowSet"
#> attr(,"package")
#> [1] "flowCore"
length(SUBSET)
#> [1] 2
```

`FLOWSET[c(1, 3)]` says "give me files 1 and 3." What you get back is still a flowSet, just a smaller one, containing those two files. Run `class(SUBSET)` and it will still say `"flowSet"`. A useful way to picture this: imagine `FLOWSET` is a filing cabinet with 5 folders in it. `FLOWSET[c(1, 3)]` takes folders 1 and 3 out, but they're still folders, just fewer of them, sitting in a smaller cabinet.

**Double brackets `[[ ]]`: reach inside and take one file out on its own**


``` r
FLOWFRAME <- FLOWSET[[1]]
class(FLOWFRAME)
#> [1] "flowFrame"
#> attr(,"package")
#> [1] "flowCore"
```

`FLOWSET[[1]]` says "give me what's inside file 1, not wrapped up as a flowSet anymore." Run `class(FLOWFRAME)` and it now says `"flowFrame"`, a different, single-file object. Going back to the filing cabinet: this is like opening folder 1 and tipping its actual contents out onto the desk. There's no folder around it anymore, just the contents themselves.

Because of this, double brackets can only ever give you one thing at a time. You can't write `FLOWSET[[c(1, 3)]]`, R won't know whether to tip out folder 1 or folder 3, it needs exactly one answer.

**The rule of thumb:** single bracket `[` keeps the folder. Double bracket `[[` empties it onto the desk. If the function you're about to use expects a flowSet (you'll meet several of these later in this chapter, like `fsApply()`), use `[`. If you specifically need the one flowFrame underneath, use `[[`.

**Dollar sign `$`: get one named piece of information, not by position**

Brackets, single or double, work by position, first, third, whichever number you give them. `$` works completely differently, it works by name, on data frames specifically.

This is a good moment to reconnect to something from earlier in this section: flowSet is an S4 object, and S4 objects use `@` internally, not `$`. So you'll never write `FLOWSET$something` directly, it doesn't work, `$` isn't part of how flowSet is built. What you can do is ask a function to hand you back a plain data frame, and use `$` on that:


``` r
SAMPLE_INFO <- pData(FLOWSET)
SAMPLE_INFO$name
```

`pData(FLOWSET)` is exactly this: a function that reaches into the flowSet and hands you back an ordinary data frame describing your samples. Once you have `SAMPLE_INFO`, an actual data frame, `$name` works normally, pulling out the column called `name` by its name, not its position. You'll meet `$` again later in this course on other data frames too, for example `panel$antigen`. The pattern to remember: `$` needs a data frame to work on, flowSets and flowFrames aren't data frames, so you always go through a function like `pData()` first to get one.

Check what you extracted with double brackets:


``` r
class(FLOWFRAME)
#> [1] "flowFrame"
#> attr(,"package")
#> [1] "flowCore"
```

### Examining Data Dimensions

A flowSet holds n flowFrames. Our `FLOWSET` holds 5, for instance. `fsApply()` applies a function to every flowFrame in a flowSet, regardless of how many there are. Think back to the filing cabinet from earlier: `fsApply()` is like sending someone down the row of folders with one instruction, "do this same task to every folder", who then hands you back a stack of results, one per folder.

Check how much data you have:


``` r
nrow(FLOWFRAME) # tells you the number or rows i.e. how many events have data recorded withing hte FlowFrame
#> [1] 30825
nrow(FLOWSET) # Returns "NULL" showing these types of commands expecta flowFrame, not a flowSet
#> NULL
fsApply(FLOWSET, nrow) # Use fsApply to use "nrow()" to every flowFrame within a flowSet
#>                           [,1]
#> 2PFANASPermLIVE.fcs      30825
#> 4PFA1GLUTNASPermLIVE.fcs 14171
#> 4PFANASPermLIVE.fcs      15158
#> 4PFANoPermLIVE.fcs       57521
#> 8PFANASPermLIVE.fcs      23790
```

`FLOWSET` holds 5 separate files. There's no single "number of rows" for the whole thing, each file has its own. `nrow(FLOWSET)` on its own wouldn't work properly, `nrow()` expects one table, and `FLOWSET` isn't one table, it's a collection of five.

`fsApply()` takes two things, a flowSet and a function, runs the function once per flowFrame inside it, and hands back all the individual answers together. `fsApply(FLOWSET, nrow)` means "open every folder, run `nrow()` on what's inside, and bring back one answer per folder." The function doesn't have to be `nrow()`, `fsApply()` works with whatever function you give it, that's why you'll see it reused throughout this course.

**What nrow means:** "Number of rows" - since data is organised with one cell per row, this tells you cell counts.

Check how many markers:


``` r
ncol(FLOWSET[[1]])
#> [1] 61
```

This shows the number of columns (channels/markers) in the first file.

### Understanding Channel Names

Cytometry files have two naming systems:

**Channel names** (detector names):

``` r
colnames(FLOWSET)
```
Shows the technical detector identifiers like "Ir191Di"

**Marker names** (biological annotations):

``` r
markernames(FLOWSET)
```
Shows what was actually measured like "DNA1" or "CD235ab"

**Why both?** Channels are fixed by the instrument. Markers are what you label them during acquisition. The same channel might measure different markers in different experiments.

### Accessing Expression Data

The actual cell measurements are stored in the "expression matrix":


``` r
exprs(FLOWFRAME)[1:5, 1:5]
#>          Time Event_length    Y89Di    Pd102Di Rh103Di
#> [1,] 3950.378           36 1.900429 0.00000000       0
#> [2,] 4000.169           23 0.000000 0.00000000       0
#> [3,] 4002.812           59 0.000000 0.08926275       0
#> [4,] 4037.318           24 0.000000 0.00000000       0
#> [5,] 4064.141           25 0.000000 0.00000000       0
```

This shows the first 5 cells and first 5 channels. Each number is a measurement - the intensity detected for that marker on that cell.

**What `exprs()` means:** "Expression data" - the core measurements from your experiment.

### Keywords and Metadata

FCS files store additional information as keywords:


``` r
keyword(FLOWFRAME, "FILENAME")
#> $FILENAME
#> [1] "/Volumes/T31/CLAUDE/Analysing-Cytometry-Data-With-R/Data/fcs/2PFANASPermLIVE.fcs"
```

There are dozens of keywords storing information like:
- Instrument used
- Acquisition date
- Operator name
- Software version
- Panel information

You can see all keywords (warning: very long output):

``` r
keyword(FLOWFRAME)
```

### Working with Multiple Files

The power of flowSets is applying operations to all files at once.

**Get dimensions for all files:**

``` r
fsApply(FLOWSET, dim)
#>                          events parameters
#> 2PFANASPermLIVE.fcs       30825         61
#> 4PFA1GLUTNASPermLIVE.fcs  14171         61
#> 4PFANASPermLIVE.fcs       15158         61
#> 4PFANoPermLIVE.fcs        57521         61
#> 8PFANASPermLIVE.fcs       23790         61
```

**Get median marker expression:**

``` r
fsApply(FLOWSET, each_col, median)[1:5, 1:5]
#>                              Time Event_length Y89Di
#> 2PFANASPermLIVE.fcs      304295.3           31     0
#> 4PFA1GLUTNASPermLIVE.fcs 528082.2           26     0
#> 4PFANASPermLIVE.fcs      351627.6           32     0
#> 4PFANoPermLIVE.fcs       459395.4           30     0
#> 8PFANASPermLIVE.fcs      637790.6           32     0
#>                          Pd102Di   Rh103Di
#> 2PFANASPermLIVE.fcs            0 0.0000000
#> 4PFA1GLUTNASPermLIVE.fcs       0 0.7995695
#> 4PFANASPermLIVE.fcs            0 0.0000000
#> 4PFANoPermLIVE.fcs             0 0.0000000
#> 8PFANASPermLIVE.fcs            0 0.0000000
```

This calculates the median for each channel in each file. The `[1:5, 1:5]` limits output to the first 5 files and channels for readability.

### Subsetting Data

You can select specific files or channels:

**Select specific samples:**

``` r
SUBSET <- FLOWSET[c(1,3,5)]
length(SUBSET)
#> [1] 3
```

This creates a new flowSet with only samples 1, 3, and 5.

**Select specific channels:**

``` r
MARKERS_ONLY <- FLOWSET[, 7:15]
ncol(MARKERS_ONLY[[1]])
#> [1] 9
```

This keeps only columns 7-15 (marker channels, excluding measurement channels).

### Data Structure Summary

```
FLOWSET (all files together)
├── FLOWFRAME 1 (2PFANASPermLIVE.fcs)
│   ├── @exprs (expression matrix: cells × markers)
│   ├── @parameters (channel information)
│   └── @description (metadata and keywords)
├── FLOWFRAME 2 (4PFA1GLUTNASPermLIVE.fcs)
│   └── ...
└── FLOWFRAME 5 (8PFANASPermLIVE.fcs)
    └── ...
```

### Saving and Loading

**Save objects for later:**

``` r
saveRDS(FLOWSET, here("Data", "RDS", "FLOWSET.rds"))
```

**Load saved objects:**

``` r
FLOWSET <- readRDS(here("Data", "RDS", "FLOWSET.rds"))
```

**Why use RDS?**
- Much faster than re-reading FCS files
- Preserves all R object properties
- Portable between computers
- Smaller file size than FCS

### Common Operations Summary


``` r
# Check what you have
length(FLOWSET)              # Number of files
sampleNames(FLOWSET)         # File names
colnames(FLOWSET)            # Channel names
markernames(FLOWSET)         # Marker annotations

# Get information
fsApply(FLOWSET, nrow)       # Cell counts
ncol(FLOWSET[[1]])           # Number of channels
keyword(FLOWSET[[1]], "key") # Specific keyword

# Access data
FLOWFRAME <- FLOWSET[[1]]    # Extract one file
exprs(FLOWFRAME)             # Get expression matrix
```

### Troubleshooting

**Problem:** Error "cannot open file"  
**Solution:** Check your file path with `here("Data", "fcs")` and verify files exist there

**Problem:** Fewer files loaded than expected  
**Solution:** Make sure all FCS files are in the correct folder and have `.fcs` extension

**Problem:** `markernames()` shows all `NA`  
**Solution:** Your files may not have marker annotations - this is okay, you can still use channel names

**Problem:** Object not found  
**Solution:** Make sure you ran the code to create the object first

### What's Next

Now that you can load and examine cytometry data, the next chapters will show you how to:
- Visualise the data to see populations
- Gate out unwanted events  
- Clean and transform the data
- Apply advanced analysis

The flowSet structure you've learned here will be used throughout all subsequent analyses.
