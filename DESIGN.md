---
name: Goodfinds
description: A quiet museum-shop catalog for repeatable demo shopping journeys.
colors:
  evergreen: "#244b3d"
  evergreen-hover: "#163c2d"
  ink: "#202e28"
  muted: "#64716a"
  paper: "#fafbf8"
  line: "#dce2da"
  soft: "#edf1e9"
  error: "#a52d27"
  focus: "#658839"
  white: "white"
typography:
  display:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-.03em"
  headline:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-.03em"
  title:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-.025em"
  body:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  label:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  badge: "4px"
  compact: "6px"
  control: "7px"
  notice: "8px"
  surface: "12px"
  dialog: "14px"
spacing:
  tight: "7px"
  control-gap: "9px"
  small: "12px"
  medium: "20px"
  section: "24px"
  panel: "25px"
components:
  button-primary:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.evergreen-hover}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.soft}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  navigation:
    textColor: "{colors.muted}"
  stock-badge:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.badge}"
    padding: "4px 8px"
  summary:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "25px"
---

# Design System: Goodfinds

## Overview

**Creative North Star: "The Small Museum Gift Shop"**

Restrained evergreen wayfinding, pale gallery surfaces, factual object labels, and a quiet photographic catalog support familiar shopping tasks. Controls stay compact and readable; clear state signals carry through catalog, cart, checkout, and testing guide.

This is source-derived documentation of the implemented system, using the direction contract's internal metaphor. The direct code build and visual direction were implementation assumptions after optional questions went unanswered; they are not user-approved visual choices. Screenshot review was unavailable.

**Key Characteristics:**
- Pale surfaces with evergreen actions.
- System sans typography and factual labels.
- Flat catalog framing and softly rounded controls.
- Immediate state feedback with minimal motion.

## Colors

### Primary

Evergreen supplies primary actions, active navigation, icons, success messages, and the demo strip. Evergreen hover deepens primary buttons; focus green supplies the visible keyboard outline.

### Neutral

Paper is the page canvas; white separates fields and secondary actions. Ink carries headings and values, while muted carries supporting labels. Soft shades selected filters and summaries. Line separates rows and controls. Error is reserved for validation messages and invalid field borders.

**The State Signal Rule.** Pair color with text, borders, selection controls, or disabled behavior so state remains explicit.

## Typography

Display and body both use the system sans stack in the frontmatter. The broad hierarchy is semibold, with slightly tightened headings; supporting labels remain compact. Consolas with monospace fallback distinguishes fixture values and selectors in the testing guide.

Display applies to the catalog heading; headline applies to default page headings; title applies to section headings. Product titles use a smaller semibold size (15px; 14px below 1000px; 13px below 760px). Prices and counts use tabular numerals. The mobile catalog heading reduces to 34px and default page headings to 30px. Detail descriptions stop at 48ch; expanded guide answers stop at 75ch.

## Layout

The main shell and header cap at 1440px with 5% horizontal padding. The desktop shop pairs a 190px filter rail with a flexible catalog, separated by 44px. The catalog uses three columns and gaps of 29px vertically and 24px horizontally. Cart and checkout use a flexible task column plus a 340px summary, separated by 55px.

At 1000px, the rail narrows to 155px, the catalog gap tightens, and the summary narrows to 300px. At 760px and below, navigation wraps to a full row, filters become a toggled region, the catalog becomes two columns, and summaries follow the task. Forms retain their two-column field grid with full-width address and country fields. Above 1500px, catalog images widen from an aspect ratio of 1.16 to 1.3; mobile images use .95.

## Elevation & Depth

Catalog cards are flat. Pale tonal containers and fine borders establish grouping. Shadows appear on transient overlays: the toast uses `0 8px 32px #162d2829`; the reset dialog uses `0 20px 80px #0a281938`, with a translucent `#122b2166` backdrop.

**The Overlay Depth Rule.** Reserve shadows for the toast and modal layer; keep catalog and summary surfaces flat.

## Shapes

Rounded image frames and major containers use the surface radius. Controls use the control radius; compact add and quantity controls use the compact radius. Small status labels use the badge radius, and the reset dialog has the largest corners. Thin borders, circular cart counts, and simple outlined SVG icons complete the form language.

## Components

### Buttons

Primary and secondary actions share semibold type (13px), inline alignment, a 44px minimum height, and the control geometry in the frontmatter. Primary hover deepens evergreen; secondary hover uses soft. Disabled buttons lower opacity and show a blocked cursor. Compact product add actions use an outlined evergreen treatment and invert to evergreen with white text on hover.

### Inputs / Fields

White fields have line-colored borders and a 44px minimum height. Labels are semibold and sit above fields; search embeds an outlined magnifier. Focus uses a 3px focus-green outline, offset by 2px for fields and 4px for buttons and links. Invalid checkout fields change the border to error and show an associated inline message. No extra input hover treatment is implemented.

### Navigation

Desktop navigation uses muted 14px text. The active route becomes semibold evergreen with a thin underline; hover uses a text underline. Mobile navigation uses 13px text in its own row. The QA label resolves to 11px after the stylesheet's accessibility override.

### Cards / Containers

Products have unboxed factual labels beneath rounded, clipped photography. The image scales to 1.035 over 220ms with ease-out on hover. Sold-out imagery uses partial grayscale and reduced opacity with a literal availability label and disabled add action. Summaries use soft backgrounds, panel padding, separated totals, and tabular amounts.

### Chips / Status Labels

Stock labels overlay the image's upper left corner. Order status combines a check icon and explicit confirmation text on soft. Noninteractive badges have no invented hover state. Mobile accessibility overrides keep stock labels and order status at 11px.

### Feedback and Motion

Toast opacity and position transition over 180ms with ease-out; it stays visible for 3200ms. Catalog results update immediately. Reduced motion disables transitions and animations; there are no entrance animations.

## Do's and Don'ts

### Do:
- Do preserve visible keyboard focus and text explanations of state.
- Do use tonal containers and fine borders to group factual information.
- Do preserve tabular numerals for prices and counts.
- Do respect reduced-motion preferences.

### Don't:
- Don't add resting shadows to catalog cards or summaries.
- Don't replace availability labels or validation text with color alone.
- Don't hide the demo nature of purchase and account actions.
- Don't treat this source-derived record as screenshot verification or user visual approval.
