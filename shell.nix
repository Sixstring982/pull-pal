{ pkgs ? import <nixpkgs> {} }:
let pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.05.tar.gz") {};
in pkgs.mkShell {
  packages = [ pkgs.nodejs-16_x ];
}


