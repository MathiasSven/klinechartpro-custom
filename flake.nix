{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      pkgs = forAllSystems (system: nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (system: {
        default = pkgs.${system}.buildNpmPackage {
          name = "klinechartpro-custom";
          src = ./.;
          npmDepsHash = "sha256-WkTgKhB/g77RD5Jo4tOEj69cBrGsI97vlIcmomQ/X8A=";

          outputs = [ "dist" "ts" "js" "css" "out" ];

          installPhase = ''
            mkdir $dist $ts $js $css

            npm run build

            cp dist/* $dist/
            cp dist/*.ts $ts/
            cp dist/*.js $js/
            cp dist/*.css $css/
            cp dist/*.map $js/

            ln -s $dist $out
          '';
        };
      });
    };
}
