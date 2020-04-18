#!/usr/bin/env bash
set -ex

export DEBIAN_FRONTEND=noninteractive

echo 'APT::Default-Release "buster";' >/etc/apt/apt.conf.d/default-release

# The following aspell packages exist in Ubuntu but not Debian:
# aspell-af, aspell-id, aspell-nr, aspell-ns, aspell-ss, aspell-st, aspell-tn,
# aspell-ts, aspell-xh, aspell-zu
echo "deb http://archive.ubuntu.com/ubuntu/ bionic main universe" > /etc/apt/sources.list.d/bionic.list
apt-key adv --no-tty --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32

# Need to install aspell-ta from unstable as it is broken/not updated in stable.
echo "deb http://deb.debian.org/debian/ unstable main" > /etc/apt/sources.list.d/unstable.list
printf 'Package: aspell-ta\nPin: release a=unstable\nPin-Priority: 1337\n' \
  > /etc/apt/preferences.d/aspell-ta-from-unstable

apt-get update
apt-get install \
  aspell \
  aspell-af \
  aspell-am \
  aspell-ar \
  aspell-ar-large \
  aspell-bg \
  aspell-bn \
  aspell-br \
  aspell-ca \
  aspell-cs \
  aspell-cy \
  aspell-da \
  aspell-de \
  aspell-de-1901 \
  aspell-el \
  aspell-en \
  aspell-eo \
  aspell-es \
  aspell-et \
  aspell-eu-es \
  aspell-fa \
  aspell-fo \
  aspell-fr \
  aspell-ga \
  aspell-gl-minimos \
  aspell-gu \
  aspell-he \
  aspell-hi \
  aspell-hr \
  aspell-hsb \
  aspell-hu \
  aspell-hy \
  aspell-id \
  aspell-is \
  aspell-it \
  aspell-kk \
  aspell-kn \
  aspell-ku \
  aspell-lt \
  aspell-lv \
  aspell-ml \
  aspell-mr \
  aspell-nl \
  aspell-no \
  aspell-nr \
  aspell-ns \
  aspell-or \
  aspell-pa \
  aspell-pl \
  aspell-pt \
  aspell-pt-br \
  aspell-ro \
  aspell-ru \
  aspell-sk \
  aspell-sl \
  aspell-ss \
  aspell-st \
  aspell-sv \
  aspell-ta \
  aspell-te \
  aspell-tl \
  aspell-tn \
  aspell-ts \
  aspell-uk \
  aspell-uz \
  aspell-xh \
  aspell-zu \
  --yes

rm -rf /var/lib/apt/lists/* \
  /etc/apt/apt.conf.d/default-release \
  /etc/apt/sources.list.d/bionic.list \
  /etc/apt/sources.list.d/unstable.list \
