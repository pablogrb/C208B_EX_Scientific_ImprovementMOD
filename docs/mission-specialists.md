# Mission specialist implementation

## Scope

This separate MSFS 2024 SimObjects patch enables two occupants in the scientific observations cabin using existing passenger seat behavior and EFB payload loading. It does not modify the existing C208B EX Improvement Mod.

## Cabin navigation graph

The [scientific cabin navigation graph](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/navigation_graph/navigation_graph_passenger.cfg) assigns `SEAT_C208B_Pax_1` to the existing `OPERATOR` node at `SCIENTIFIC_CHARACTER_00` and to a second node at `SCIENTIFIC_CHARACTER_01`. These model nodes place the occupants in the existing seats.

`Seat_00` and `Seat_01` map to payload stations `TT:MENU.PAYLOAD.PASSENGER_03` and `TT:MENU.PAYLOAD.PASSENGER_04`, respectively. Each mass section has a maximum of 300 and a fill priority of 1 or 2. A `PLANE_ENTRANCE` node is added, while the existing scientific mission and director nodes and graph edges are retained. No new edges are added.

## Payload stations

The [scientific preset flight model](../SimObjects/Airplanes/asobo_c208b/presets/asobo/c208b_scientific/config/flight_model.cfg) defines a maximum of 15 payload stations. It retains the 11 stock scientific preset entries and adds pilot and copilot stations with 170 lb defaults, followed by two specialist stations with zero default weight. The station entries specify weight and longitudinal, lateral and vertical offsets from the aircraft datum; the specialist offsets are estimates inferred from model anchors, not verified center-of-gravity positions.

The complete station list is defined in the preset because an earlier attachment-only approach did not expose the additional stations in the running aircraft. The [scientific cabin attachment flight model](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/config/flight_model.cfg) enables automatic modular merging and retains the stock attachment maximum of 13; that value is a maximum, not the number of loaded occupants. The scientific preset specifies 15.

The preset also retains the stock `OBJ_EA1_PitotFLAG.5` definition for the engine-cover remove-before-flight flag. In a simulator check, the flag was no longer visible after removing this section from the Community package, so it is retained even though it is unrelated to passenger loading.

## Package and verification

The [manifest](../manifest.json) identifies the package as a `SIMOBJECTS_PATCH`. The [layout](../layout.json) indexes the simulator configuration and runtime files with sizes and timestamps. Update the layout and package size when changing package content. The [scientific equipment implementation](scientific-equipment.md) uses the native mass-and-balance listener to check Specialist A; it does not rely on the legacy station-weight list described below.

In simulator testing, the EFB exposed controls for both specialists, their models appeared in the intended seats, and saved flight payload values reflected changes. Removing one 170 lb passenger reduced the displayed aircraft weight by 170 lb. The debug station-weight list did not reflect the passenger changes; its semantics have not been established.

ATC boarding, mission compatibility, exact specialist mass positions and possible pilot or copilot weight double-counting have not been comprehensively verified.