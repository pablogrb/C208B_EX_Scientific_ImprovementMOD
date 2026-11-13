# Scientific equipment electrical system

## Status and scope

Feature 2 adds simulated instrument electrical demand and operating-state logic, not LiDAR scanning or camera image capture. Automated tests cover the aircraft controller without creating an EFB instance. Type checking and bundling pass. The powered simulator acceptance checklist below remains pending; mocked SimVars do not establish that MSFS has merged the electrical topology or supplies the expected current.

Feature 1's payload and cabin navigation files are unchanged. No permanent equipment masses, mount masses or feature 3 enforcement are added.

### Live validation record (2026-11-13)

- Native EFB discovery included the app script, but the first build failed to parse optional chaining. The simulator also lacks `Array.flatMap`, `Promise.finally` and `Promise.allSettled`. The build now targets ES2015 and controller tests explicitly remove these APIs.
- With the user's permission, the corrected source bundles were temporarily hot-loaded through the local simulator debugger. The app registered and appeared in the EFB. The controller produced a changing heartbeat and valid crew telemetry with no current integration error.
- The native mass-and-balance listener worked in the manager gauge. Its section names are payload identifiers, not navigation-graph mass-section names. Live Specialist A occupancy was observed through `PASSENGER_03`; the parser and test fixtures were corrected accordingly.
- New electrical definitions were moved from the final preset to the scientific cabin attachment. The corrected package was deployed and its hashes verified, but successful powered operation was not established.
- Battery/avionics and engine-start tests failed, and MSFS subsequently crashed during this test session. The cause of the crash was not established. After a user-approved complete Community rollback to the original feature-1 package, the user reported the same avionics and oil-pressure/startup failure. The startup problem is therefore not isolated to feature 2; no unrelated engine or aircraft-power changes were made to work around it.
- The user deferred further live testing. **Community is left on the original feature-1 version (three indexed files, 5,057 bytes), hash-verified.** This repository retains the experimental feature-2 source and built files. Reinstalling this source package is a separate action; it has not been left enabled in Community.

## Runtime flow, file by file

1. [Scientific attachment systems.cfg](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/config/systems.cfg) appends through the scientific cabin attachment into the aircraft's version 2 electrical system, rather than redefining indexed entries in the final preset. `PWR_BUS_DISTRIB` feeds `Scientific_Equipment_Bus` through the named 60 A feed protection. Separate 30 A LiDAR and 25 A camera branches supply native `CIRCUIT_XML` consumers. Names, not final merged circuit numbers, identify components.
2. [Scientific cabin panel.cfg](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/panel/panel.cfg) adds an invisible `NO_TEXTURE` 1 x 1 manager gauge to the scientific attachment. This is the SDK's documented invisible-gauge mechanism; it is not an EFB page or a powered cockpit display.
3. [Attachment panel.xml](../SimObjects/Airplanes/asobo_c208b/attachments/asobo/function_interior_cabin_scientific/panel/panel.xml) requests `AlwaysUpdate` for that manager. [Preset panel.xml](../SimObjects/Airplanes/asobo_c208b/presets/asobo/c208b_scientific/panel/panel.xml) enables XML auto-merging. Neither file replaces the shared G1000 configuration or the improvement mod's plugin.
4. [Controller.html](../html_ui/Pages/VCockpit/Instruments/C208Scientific/Controller.html) imports the simulator's `BaseInstrument` and the built controller script.
5. [Controller.ts](../src/Controller.ts) registers the aircraft-side instrument. It polls the native `JS_LISTENER_MASS_AND_BALANCE` / `GET_SEATS` interface every 500 ms and invalidates its cached crew state on `SEATS_UPDATED`. Missing, malformed, ambiguous or stale crew data inhibits operation. A query that hangs cannot keep its previous authorization beyond 1.5 seconds.
6. [equipment.ts](../src/equipment.ts) identifies Specialist A by the native listener's stable payload-section name `TT:MENU.PAYLOAD.PASSENGER_03` (the navigation graph maps `Seat_00` to this name), rather than a legacy payload-station index. It requires positive live occupation and mass, not merely configured occupation. It holds equipment names and the command/authorization/powered-state decision. Specialist B (`PASSENGER_04`) is not part of the authorization decision.
7. The controller updates at up to 10 Hz. A request requires fresh A occupancy, an eligible power source and a scientific bus within the model's 20-32 V operating range before the controller closes the native equipment switch. Eligible sources are an active main generator with its distribution connection intact, or available, switched-on, connected external power with adequate voltage. A generator switch alone is not proof of generation.
8. Native `CIRCUIT ON`, circuit voltage/current, and feed/branch breaker states determine actual powered status. A retained request cannot imply power. Loss of crew, source or bus voltage opens the equipment switches; a native breaker or disconnected line also removes native power. The controller does not change breakers or override line protection. Read/write failures log an error and attempt to shut down both circuits.
9. [sim.ts](../src/sim.ts) wraps simulator reads and writes. Non-finite or nonnumeric readback is an explicit error. Named SimVars use the simulator's `:'ComponentName'_n` syntax.
10. [ScientificEquipmentApp.tsx](../src/ScientificEquipmentApp.tsx) extends the official EFB SDK's `App` and `AppView` and registers with `Efb.use`. It writes only the two request LVars. It reads aircraft-controller status and native voltage/current for display. It never authorizes crew or operates a circuit itself. A changing controller heartbeat is required to enable its buttons; stale data is shown as unknown, not as powered.
11. [ScientificEquipment.css](../html_ui/efb_ui/efb_apps/ScientificEquipment/ScientificEquipment.css) styles the app; [ScientificEquipment.svg](../html_ui/efb_ui/efb_apps/ScientificEquipment/ScientificEquipment.svg) supplies its icon. The EFB discovers the built script under `html_ui/efb_ui/efb_apps/ScientificEquipment`. The app remains visible but disabled when no scientific controller is running.
12. [build.mjs](../build.mjs) bundles the controller and EFB app into their respective `html_ui` locations, targeting ES2015 syntax for Coherent compatibility. It uses the simulator's `msfssdk` global rather than embedding another SDK instance. [package.json](../package.json), its lockfile and [tsconfig.json](../tsconfig.json) define the SDK dependencies, reproducible install and type checking. [Third-party notices](../html_ui/efb_ui/efb_apps/ScientificEquipment/THIRD-PARTY-NOTICES.txt) accompany redistributed dependencies.
13. [manifest.json](../manifest.json) identifies version 0.2.0 as a SimObjects patch. [layout.json](../layout.json) indexes only simulator content. The workspace metadata, validation and Community comparison scripts now support both `SimObjects` and `html_ui`; source, tests, dependencies and documentation are not indexed or deployed by those scripts.

## Command and telemetry contract

All variables below are aircraft-local `L:C208_SCI_...` variables.

| Suffix | Writer | Meaning |
| --- | --- | --- |
| `LIDAR_REQUESTED`, `CAMERA_REQUESTED` | EFB | Independent retained ON requests, 0 or 1 |
| `LIDAR_POWERED`, `CAMERA_POWERED` | Aircraft controller | Actual authorized/native powered state |
| `LIDAR_STATUS`, `CAMERA_STATUS` | Aircraft controller | Enumerated reason from `equipment.ts` |
| `CREW_KNOWN`, `CREW_PRESENT` | Aircraft controller | Freshness and live Specialist A occupancy |
| `SOURCE_AVAILABLE` | Aircraft controller | Main generator or external-power authorization |
| `ERROR` | Aircraft controller | Integration/crew-data error indication |
| `HEARTBEAT` | Aircraft controller | Changing timestamp; EFB watches changes, not cross-context clock offsets |

ON requests intentionally survive temporary inhibition and resume automatically when crew/power return. Breakers are never automatically reset. A brief transition between commanding a native switch and receiving its powered readback is expected; there is no success-shaped powered fallback.

## Load assumptions

[95West's equipment list](https://www.95westaerial.com/about-us/equipment/) identifies a RIEGL VQ-1560 II-S and Vexcel UltraCam Eagle Mark 3 f80. These are plausible references for the scientific cabin, not proof of Asobo's source aircraft.

- LiDAR: **550 W**, the published maximum with integrated options. Its published typical load is 370 W; this implementation conservatively uses the maximum continuously while operating. [RIEGL January 2022 datasheet](https://eaglemapping.com.mx/wp-content/uploads/2023/01/RIEGL_VQ-1560II-S_Datasheet_2022-01-26.pdf).
- Camera: **400 W**, the Eagle M3 brochure's maximum. [Manufacturer brochure](https://www.vexcel-imaging.com/wp-content/uploads/2017/10/UC_Eagle_M3.pdf).
- Total: **950 W**, approximately **33.93 A at 28 V** (19.64 A LiDAR, 14.29 A camera), before unrelated aircraft loads.
- Mounts, external recorders, installation overhead and startup transients are excluded because their installed configuration is unconfirmed.
- The common simulated 20-32 V enable envelope is based on the LiDAR supply specification; it is not a verified camera voltage specification.
- Feed/branch breaker ratings are simulation design assumptions allowing the modeled constant-power demand down to 20 V (47.5 A combined). They are not approved installation or wiring specifications.

## Build and local validation

With Node.js 24 LTS and npm available, from the package root:

```powershell
npm ci
npm run build
npm test
```

From the outer workspace, then run:

```powershell
.\scripts\Update-PackageMetadata.ps1
.\scripts\Test-Package.ps1
```

Built scripts are included in the package. Node.js, npm and the SDK development packages are not runtime requirements.

[equipment.test.mjs](../tests/equipment.test.mjs) bundles and runs the actual controller in an isolated simulated gauge environment without `Array.flatMap`, `Promise.finally` or `Promise.allSettled`, which are absent from the tested simulator engine. It checks A versus B occupancy, independent requests, native power readback, closed-EFB operation, generator loss/GPU restoration, voltage loss, breaker indication/no resets, stale/failed crew queries and fail-closed readback errors.

## Pending simulator acceptance checklist

Close MSFS before deploying the package, restart it, and select the scientific variant parked in free flight. Do not treat successful local tests as completion of these integration checks.

1. Confirm the preset electrical merge contains the scientific bus, both consumers and all three protected lines, and the shared improvement-mod instruments still work.
2. Confirm the manager gauge runs and the Scientific Equipment app appears without JavaScript errors. Check the `PASSENGER_03` DTO against live EFB boarding/removal. The listener has been confirmed accessible in this gauge, with stable payload-section names; boarding/removal acceptance tests remain necessary.
3. With neither specialist, request both ON: both remain unpowered. Load only B: neither may operate. Load A without B: both may operate.
4. With eligible power and A present, toggle each instrument independently. Measure native current near 19.64 A and 14.29 A at 28 V, or the corresponding `W / V` values at actual voltage. With both OFF there must be no scientific consumer demand.
5. Leave commands ON, close the app and then the EFB, and remove A through loading controls. Verify native equipment current drops to zero without reopening Scientific Equipment. Repeat from an external camera view.
6. With the app closed, fail/disconnect the main generator without external power. Even with battery/standby voltage available, scientific current must stop. Restore the main generator or supply connected external power: pending ON commands may resume.
7. Use DevMode electrical debugging to open each branch breaker and then the feed breaker. Confirm appropriate native current loss and app indication; no breaker may be automatically reset. Also test loss of bus voltage and a disconnected line.
8. Repeat cold-and-dark and hot starts, then switch to a nonscientific aircraft and confirm the app cannot control unrelated circuits. Do not deliberately induce aircraft failures outside simulator testing.

Record actual simulator results before removing the experimental-status notice.
