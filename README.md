# C208B EX Scientific Improvement MOD

An MSFS 2024 Community mod for the Cessna 208B Grand Caravan EX scientific observations variant. It enables up to two mission specialists to be loaded into the existing cabin seats using the EFB, and adds protected LiDAR and camera electrical loads with a Scientific Equipment EFB app.

**Feature 2 validation status:** builds and automated controller tests pass. Live testing confirmed EFB discovery and the native crew interface, and exposed JavaScript compatibility issues that have been corrected. Full powered-operation, amperage and protection checks remain unverified; live testing was deferred. Treat this source version as experimental, not a completed release.

## Requirements

- Microsoft Flight Simulator 2024 and the C208B EX scientific observations aircraft.
- The mod is intended to work alongside the [C208B EX Caravan Improvement Mod](https://flightsim.to/addon/104577/msfs-2024-c208b-ex-caravan-improvement-mod); that mod is optional and is not modified by this package.

## Installation

1. Download and extract the release archive, or download and extract the GitHub repository.
2. Copy the `C208B_EX_Scientific_ImprovementMOD` package folder into your MSFS 2024 `Community` folder. The folder directly inside `Community` must contain `manifest.json`, `layout.json`, `SimObjects` and `html_ui`. Release packages include the built JavaScript; Node.js is not needed to fly.
3. Restart the simulator if it was running.

Your `Community` folder location depends on where your simulator packages are installed. For a standard Steam installation it is commonly under `%APPDATA%\Microsoft Flight Simulator 2024\Packages\Community`.

To uninstall, close the simulator and remove the `C208B_EX_Scientific_ImprovementMOD` folder from `Community`.

## Use

Select the scientific observations variant and use the EFB loading controls to add or remove up to two passengers. They appear in the existing specialist seats and contribute to aircraft payload weight.

Open **Scientific Equipment** in the EFB:

1. Load **Specialist A** at the operator console. Specialist B is optional and cannot substitute for A.
2. Supply the aircraft from its main generator or connected external ground power. Battery and standby-alternator-only operation are deliberately inhibited.
3. Use each equipment button to toggle its **command** ON or OFF. The separate status and voltage/current readouts show whether it is actually powered.
4. Close the app whenever desired. The aircraft-side controller continues enforcing crew and power requirements.

Pending ON commands are retained during crew or power loss and automatically resume when conditions permit. Set both commands OFF before boarding crew, restoring power or servicing breakers. The controller never resets a breaker.

The model uses 550 W for LiDAR and 400 W for the camera, excluding unconfirmed mounts and ancillary equipment. These are conservative published maximum instrument loads, not measured complete-installation consumption. Equipment mass is unchanged; feature 3 is not implemented.

The app is discoverable in other aircraft but its controls are disabled without the scientific aircraft controller. Simulator integration diagnostics appear in the app and simulator JavaScript console.

## Technical documentation

See [Mission specialist implementation](docs/mission-specialists.md) and [Scientific equipment implementation](docs/scientific-equipment.md) for configuration details, file-by-file operation, build commands and the simulator acceptance checklist.