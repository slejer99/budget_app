# Month sheet anatomy

All 26 month sheets are structurally identical. This documents `Listopad2024`; the diff report
in `05-data-inventory.md` confirms the others match.

## Two regions

| Columns | Region | Editable? |
|---|---|---|
| `B`–`G` | Summary / analysis block | **No** — all formulas except `C` (planned) and `G` (comment) |
| `I`–`AM` | Day grid, one column per day 1–31 | **Yes** — this is where actuals are typed |

The summary columns are: `B` category name, `C` **planned**, `D` **actual** (`=SUM` across the
day grid for that row), `E` difference, `F` % realisation, `G` free-text comment.

## Row map

| Rows | Meaning |
|---|---|
| 1 | `G1` = month anchor date; `I1:AM1` = day numbers 1–31 |
| 2 | `D2` month label; `I2:AM2` weekday names derived from `G1` |
| 9–21 | Dashboard: planned income/expense, left to allocate, actuals, spend headroom, days left, avg/day |
| 23–29 | Progress bars: % of income spent, % of month elapsed |
| 33–47 | Per-group realisation, one row per expense group (mirrors rows 79…247) |
| 54–55 | Income table header + `SUMA:` |
| 57 | Income group header (`Całkowite przychody`) |
| 58–72 | Income subcategories (15) |
| 76–77 | Expense table header + `SUMA:` |
| 79–257 | 15 expense groups, step 12: header row, then 10 subcategory rows, then a spacer |

Expense group header rows: 79, 91, 103, 115, 127, 139, 151, 163, 175, 187, 199, 211, 223, 235, 247.

## Key formulas

```
G1   = =DATE(('CAŁY ROK'!D2),5,1)
D2   = ="Maj "&'CAŁY ROK'!D2:E2
D9   = =C55        (planned income  = C55)
D10  = =C77        (planned expense = C77)
D12  = =D9-D10      (left to allocate)
D16  = =D55       (actual income)
D17  = =D77       (actual expense)
D19  = =D16-D17   (headroom left this month)
D20  = =IF(MONTH(G1)<MONTH(TODAY()),0,DAY(EOMONTH(G1,0))-IF(MONTH(TODAY())=MONTH(G1),DAY(TODAY()),DAY(G1))+1)
D21  = =IF(D20=0,IF(D19=0,0,-D19),D19/D20)
C77  = =C79+C91+C103+C115+C127+C139+C151+C163+C175+C187+C199+C211+C223+C235+C247
D77  = =D79+D91+D103+D115+D127+D139+D151+D163+D175+D187+D199+D211+D223+D235+D247
C79  = =SUM(Listopad2024!$C$80:$C$89)   (group planned = sum of its 10 slots)
D58  = =SUM(Listopad2024!$I58:$AM58)   (row actual = sum across day grid)
B58  = ='Wzorzec kategorii'!B15        (label pulled from category sheet)
```

## Distinct formula shapes

Cell refs normalised to `@`. This is the complete formula vocabulary of a month sheet.

| count | shape | example |
|---|---|---|
| 197 | `=SUM(Listopad2024!$@:$@)` | C57 |
| 196 | `=IFERROR(@/@,"")` | E25 |
| 177 | `='Wzorzec kategorii'!@` | B57 |
| 171 | `=@-@` | D12 |
| 93 | `=SUM(@:@)` | I55 |
| 39 | `=@` | D9 |
| 31 | `=IF(TODAY()=($@+@-1),"DZIŚ","")` | I56 |
| 30 | `=TEXT($@+@, "dddd")` | J2 |
| 15 | `=Listopad2024!$@-Listopad2024!$@` | E58 |
| 2 | `=@+@+@+@+@+@+@+@+@+@+@+@+@+@+@` | C77 |
| 1 | `=DATE(('CAŁY ROK'!@),5,1)` | G1 |
| 1 | `="Maj "&'CAŁY ROK'!@:@` | D2 |
| 1 | `=TEXT(@, "dddd")` | I2 |
| 1 | `=IF(MONTH(@)<MONTH(TODAY()),0,DAY(EOMONTH(@,0))-IF(MONTH(TODAY())=MONTH(@),DAY(TODAY()),DAY(@))+1)` | D20 |
| 1 | `=IF(@=0,IF(@=0,0,-@),@/@)` | D21 |
| 1 | `="Dzień "&IF(MONTH(@)<MONTH(TODAY()),DAY(EOMONTH(@,0)),DAY(TODAY()))&" / "&DAY(EOMONTH(@,0))` | B29 |
| 1 | `=IF(MONTH(@)<MONTH(TODAY()),1,DAY(TODAY())/DAY(EOMONTH(@,0)))` | E29 |
| 1 | `=443+550` | C203 |
| 1 | `=2200+149+300+1500+231+118` | C205 |
| 1 | `=1200+3000` | C207 |

