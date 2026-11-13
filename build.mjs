import { build } from 'esbuild';

const sdkGlobal = {
  name: 'simulator-sdk',
  setup(builder) {
    builder.onResolve({ filter: /^@microsoft\/msfs-sdk$/ }, () => ({
      path: 'msfssdk', namespace: 'simulator-sdk'
    }));
    builder.onLoad({ filter: /.*/, namespace: 'simulator-sdk' }, () => ({
      contents: 'module.exports = msfssdk;', loader: 'js'
    }));
  }
};

await build({
  entryPoints: ['src/ScientificEquipmentApp.tsx'],
  outfile: 'html_ui/efb_ui/efb_apps/ScientificEquipment/ScientificEquipment.js',
  bundle: true,
  format: 'iife',
  target: 'es2015',
  jsxFactory: 'FSComponent.buildComponent',
  jsxFragment: 'FSComponent.Fragment',
  plugins: [sdkGlobal],
  legalComments: 'eof',
  treeShaking: true
});
await build({
  entryPoints: ['src/Controller.ts'],
  outfile: 'html_ui/Pages/VCockpit/Instruments/C208Scientific/Controller.js',
  bundle: true,
  format: 'iife',
  target: 'es2015'
});
