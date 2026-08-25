# `CAŁY ROK` — the yearly rollup (currently broken)

## What it is meant to do

Same layout as a month sheet, but the day grid is replaced by **12 month columns** (`K`–`V`).
For each of the 165 category rows it computes: planned for the year (sum of the 12 months),
actual for the year, difference, % realisation, and a monthly average.

The dominant formula shapes:

```
C51 = ='Styczeń'!C57+Luty!C57+Marzec!C57+'Kwiecień'!C57+Maj!C57+Czerwiec!C57+Lipiec!C57+'Sierpień'!C57+'Wrzesień'!C57+'Październik'!C57+Listopad!C57+'Grudzień'!C57

K51 = ='Styczeń'!D57      (one column per month, L=Luty, M=Marzec, …)
D51 = =(SUM(K51:V51))           (year actual)
J51 = =(SUM(K51:V51)/$J$44)        (monthly average)
J44 = =IF($D$2=YEAR(NOW()), MONTH(NOW()), 12)
```

`D2` holds the budget year (currently **2021.0**) and is the single input that
drives the month anchor on every month sheet.

## The breakage

**Every cross-sheet reference in this sheet is dead.** It references the *original template*
sheet names, which no longer exist in the workbook:

| referenced by formulas | exists in workbook? |
|---|---|
| `CAŁY ROK` | yes |
| `Czerwiec` | **NO — #REF!** |
| `Grudzień` | **NO — #REF!** |
| `Kwiecień` | **NO — #REF!** |
| `Lipiec` | **NO — #REF!** |
| `Listopad` | **NO — #REF!** |
| `Luty` | **NO — #REF!** |
| `Maj` | **NO — #REF!** |
| `Marzec` | **NO — #REF!** |
| `Październik` | **NO — #REF!** |
| `Sierpień` | **NO — #REF!** |
| `Styczeń` | **NO — #REF!** |
| `Wrzesień` | **NO — #REF!** |
| `Wzorzec kategorii` | yes |

The month sheets were renamed (`Styczeń` → `Styczen2025`, and so on across two years) without
updating this sheet, so all 12 month columns and the year totals resolve to `#REF!`.
Cached `#REF!` error values currently in the sheet: **2927**.

Consequence: **the yearly rollup has produced no usable number for as long as the sheets have
carried their current names.** Anything the app does here is a rebuild, not a port.

