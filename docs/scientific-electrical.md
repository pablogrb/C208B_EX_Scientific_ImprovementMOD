# Scientific electrical system - increment 1

## Scope

The [scientific cabin systems configuration](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/config/systems.cfg) adds an aircraft-native MSFS 2024 v2 electrical network. No external runtime, EFB script, or new power source is involved. The scientific preset already attaches this cabin and auto-merges its systems configuration. Attachment-local indices start at 1 and are reassigned during merging; consumers must use component names, not assumed final numeric indices.

The stock exterior systems configuration (including changes from the optional Caravan Improvement Mod) is not overridden. Non-scientific presets do not attach this cabin and should receive no new network.

Crew restrictions are deliberately deferred at the user's request. This increment does not yet add EFB switches or powered-state UI. Use the simulator Electrical System debug window to control and inspect the circuits.

Switch initialization is inherited from the simulator flight state. In the engine-running test both circuits initially had their switches ON; this increment does not force a cold/off startup state.

## Loads and protection

| Group / circuit name | Instrument | Mount | Nominal total at 28 V | Current at 28 V | Published combined peak used for protection |
| --- | --- | --- | --- | --- | --- |
| `Scientific_LiDAR` | RIEGL VQ-1560 II-S, 370 W typical | One SOMAG GSM 4000, 50 W average | 420 W | 15.00 A | 550 + 180 = 730 W |
| `Scientific_Camera` | UltraCam Eagle Mark 3 f80, 400 W maximum | One SOMAG GSM 4000, 50 W average | 450 W | 16.07 A | 400 + 180 = 580 W |

Both groups on: 870 W / 31.07 A at 28 V. The camera's published maximum is used conservatively because no typical camera load is specified. Sources are the three manufacturer PDFs listed in the workspace objectives document.

Topology:

```text
PWR_BUS_DISTRIB
  -> Scientific_Feeder (80 A breaker)
    -> Scientific_Equipment_Bus
      -> Scientific_LiDAR_Supply (40 A breaker) -> Scientific_LiDAR
      -> Scientific_Camera_Supply (30 A breaker) -> Scientific_Camera
```

These are simulation design ratings, not claimed real-aircraft breaker/wiring specifications. They accommodate published combined peaks at an assumed 20 V minimum: 36.5 A LiDAR, 29 A camera, 65.5 A feeder. The LiDAR's specified operating range begins at 20 V. A 20 V minimum for the complete camera/mount group is a modeling assumption, not a published UltraCam limit.

`Voltage:28` is the nominal design voltage, **not** the undervoltage cutoff; the latter is explicitly `MinVoltage:20`. MSFS v2 derives resistance from nominal voltage/wattage, so actual load varies with supply voltage; this first increment is not a regulated constant-power model. The aircraft normally regulates near 28 V. Peak transients, startup/inrush, overvoltage shutdown, and equipment mass/CG are not modeled in this increment.

The feeder is connected to the existing distribution bus, not directly to the battery or an essential avionics bus. Existing source contactors and source availability therefore determine whether it is energized.

## Verification

From the workspace root:

```powershell
.\scripts\Test-ScientificElectrical.ps1
.\scripts\Test-ScientificElectrical.ps1 -VfsRoot "$env:APPDATA\Microsoft Flight Simulator 2024\VFSProjection"
.\scripts\Update-PackageMetadata.ps1
.\scripts\Test-Package.ps1
```

The focused checks validate loads, topology, protection headroom, names and local index continuity. The optional projected-VFS check verifies the distribution-bus reference, scientific attachment and absence of exterior name collisions. These are configuration checks, not proof of simulator merging or electrical behavior.

After installing and restarting MSFS, load the scientific variant on the ground, enable the battery and generator (or connected external power), and open **Behaviors > Debug > Electrical System**. Enable **Breakers Trip**. Verify:

1. `Scientific_Equipment_Bus`, `Scientific_LiDAR` and `Scientific_Camera` exist; no electrical configuration errors appear in the console.
2. With both circuit switches off, group current is zero. Turn each circuit on independently in the debug window. Near 28 V expect approximately 15.00 A and 16.07 A respectively; allow 5% for bus voltage/rounding. Both together should add approximately 31.07 A.
3. Pull the LiDAR branch breaker: only LiDAR current falls to zero. Repeat for the camera. Pull the feeder breaker: both groups lose supply. Reset each breaker afterwards.
4. Remove all power sources: both groups lose power even if their switches remain on. Below 20 V, neither circuit should report operational power. Switch position alone must never be treated as proof of power.
5. Leave the EFB closed and confirm the electrical loads remain active. This network is owned by the aircraft simulation.
6. Load a non-scientific C208B variant and verify these components are absent.

Use named SimVars such as `(A:CIRCUIT ON:'Scientific_LiDAR'_n, Bool)`, `(A:ELECTRICAL CIRCUIT AMPS:'Scientific_LiDAR'_n, Amperes)` and `(A:ELECTRICAL CIRCUIT VOLTAGE:'Scientific_LiDAR'_n, Volts)` for actual state. `CIRCUIT SWITCH ON` describes the switch request separately.

## Simulator results

Verified on 2026-11-13 in MSFS 2024 1.9.24.0, using the installed Community package:

| Check | Observed result |
| --- | --- |
| Scientific-only modular merge | LiDAR and camera appeared as circuits 74/75 and the new bus as bus 22 in this installation. These numeric indices are observations, not a runtime API contract. |
| LiDAR ON, 28.01 V | 15.01 A, 420.30 W; could function. |
| Camera ON, 28.01 V | 16.08 A, 450.32 W; could function. |
| Both ON | Scientific bus 31.08 A, 870.62 W. |
| Individual switches OFF | Selected circuit could not function and showed no load; switching back ON restored its load. |
| LiDAR branch breaker pulled | LiDAR branch current zero; camera remained powered; bus approximately 16.08 A / 450.32 W. |
| Camera branch breaker pulled | Camera branch current zero; LiDAR remained powered; bus approximately 15.01 A / 420.30 W. |
| Feeder breaker pulled | Bus had no load; both circuits had switches ON but could not function. Reset restored both loads. |
| All aircraft electrical sources OFF (user-operated) | Both switches remained ON; neither circuit could function or draw load. |
| EFB closed | Loads and electrical switching continued in the aircraft electrical system. |
| Passenger C208B | Filtering the electrical instance list for `scientific` returned no components. |

All manually pulled breakers were reset before the source-loss test. The tests did not alter equipment configuration in the debug editor.

**Remaining validation:** the exact 20 V operational cutoff, automatic overload trip timing, and other non-scientific variants were not live-tested. In particular, the debug view displayed zero current for the feeder breaker even while the bus supplied 31.08 A; manual feeder isolation worked, but its automatic overcurrent-trip behavior remains unverified. Do not equate the manual isolation tests with overload-trip validation. Console-wide absence of unrelated electrical errors was not audited.

## SDK references

- [Modular electrical system](https://docs.flightsimulator.com/msfs2024/retail/content-configuration/cfg-files/system/modular-electrical-system-information/)
- [Modular merging](https://docs.flightsimulator.com/msfs2024/retail/content-configuration/modular-simobjects/modular-simobject-merging/)
- [Electrical debug window](https://docs.flightsimulator.com/msfs2024/retail/devmode/editors/simobject-editor/debug/electrical-system-debug/)
