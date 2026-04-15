# Design System Strategy: High-End Concierge Editorial

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Maître D’"**

This design system is not a utility; it is a service. For a high-end condo concierge, the interface must feel as invisible and sophisticated as a world-class luxury hotel. We are moving away from "App-like" density toward an "Editorial-like" spaciousness. 

To break the "template" look, we utilize **Intentional Asymmetry**. Instead of perfectly centered grids, we use the Manrope display face to anchor views with large, left-aligned headlines that create a sense of architectural permanence. We treat the screen as a series of physical layers—depth is communicated through tonal shifts rather than lines.

---

## 2. Colors & Surface Philosophy
The palette is built on deep, nocturnal slates that mimic the glass and steel of modern luxury architecture.

### The Color Tokens
- **Background (Base):** `#0b1326` (Surface Dim)
- **Primary Action:** `#adc6ff` (Primary) / `#4d8eff` (Container)
- **Success (Active):** Custom teal-leaning blue
- **Warning (Pending):** `#ffb786` (Tertiary)
- **Error (Alert):** `#ffb4ab` (Error)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. High-end design is defined by confidence. We define boundaries through **Tonal Transitions**. A card should be distinguished from the background by moving from `surface` (`#0b1326`) to `surface-container-low` (`#131b2e`). If a boundary feels lost, increase the padding, do not add a line.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of obsidian:
1.  **Level 0 (The Floor):** `surface` - Global background.
2.  **Level 1 (The Rug):** `surface-container-low` - Large layout areas or sidebars.
3.  **Level 2 (The Table):** `surface-container` - Primary content cards.
4.  **Level 3 (The Tray):** `surface-container-high` - Popovers or active states.

### The "Glass & Gradient" Rule
To add "soul," primary buttons should not be flat. Use a subtle linear gradient from `primary` (`#adc6ff`) to `primary_container` (`#4d8eff`) at a 135-degree angle. For floating elements, use a `backdrop-blur` of 12px combined with a 40% opacity `surface_container_highest` color.

---

## 3. Typography
We use a dual-font approach to balance authority with utility.

*   **Display & Headlines (Manrope):** Use these for the "Editorial" feel. `display-lg` (3.5rem) should be used for welcome messages or unit numbers. Its geometric nature feels bespoke and architectural.
*   **Body & UI (Inter):** Reserved for technical data and concierge requests. Inter’s high x-height ensures readability against dark backgrounds where "haloing" can occur.

**Hierarchy as Identity:**
- **The Power Shift:** Use `label-sm` in ALL CAPS with 0.1em letter spacing for metadata. This "industrial" labeling contrasts beautifully against the soft, large Manrope headlines.

---

## 4. Elevation & Depth
In this system, shadows are light, not dark.

*   **The Layering Principle:** Avoid shadows on standard cards. Reserve them for "floating" interactions.
*   **Ambient Glow:** When an element floats (like a Map Pin or Tooltip), use a shadow color derived from the `on_surface` token at 5% opacity. The blur should be massive (24px to 40px) to simulate a soft ambient occlusion.
*   **The "Ghost Border" Fallback:** If a form input requires a border for focus, use `outline_variant` (`#424754`) at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Navigation Sidebar
*   **Structure:** Use `surface_container_low`. No border on the right.
*   **Active State:** Do not use a "pill" background. Use a vertical "primary" bar (2px wide) on the far left and transition the text color to `primary_fixed`.
*   **Glass Detail:** The sidebar should utilize a subtle `surface_bright` gradient at the top to simulate overhead lighting.

### Status Indicators
*   **Active:** A soft pulsing glow using `primary` with a 10% opacity outer ring.
*   **Pending:** `tertiary` (`#ffb786`) text with no background.
*   **Alert:** `error` text. Use a "Ghost Border" of the same color at 10% opacity for the container.
*   **Closed:** `on_surface_variant` (muted grey).

### Map Elements
*   **Pins:** Use a `surface_container_highest` circular base with a `primary` center dot. Avoid the "teardrop" cliché.
*   **Paths:** Use `primary` with a dashed stroke. Apply a 2px `blur` to the path to make it look like a glowing light-trail on the map.

### Form Inputs
*   **Aesthetic:** "Infilled" style. Use `surface_container_highest` with no border.
*   **Focus:** The background shifts to `surface_bright` and a 1px "Ghost Border" of `primary` appears.
*   **Roundedness:** Use the `md` (0.375rem) corner radius for a sharp, professional look.

### Cards & Lists
*   **Strict Rule:** No dividers. Separate list items using 16px of vertical space. 
*   **Interactive Cards:** On hover, do not lift the card. Instead, shift the background color from `surface-container` to `surface-container-high`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme whitespace. If a section feels crowded, double the padding.
*   **Do** use `manrope` for any text larger than 24px to maintain the signature look.
*   **Do** use "Tonal Nesting" (putting a darker container inside a lighter one) to show hierarchy.

### Don’t:
*   **Don’t** use pure black (#000). It kills the depth of the slate tones.
*   **Don’t** use 1px dividers. They create "visual noise" and cheapen the luxury feel.
*   **Don’t** use high-saturation red for alerts. Use the `error` token (#ffb4ab) which is tuned for dark-mode eye comfort.
*   **Don’t** use standard "Drop Shadows." Use ambient glows or nothing at all.