#!/usr/bin/env python2

import sys, os, shutil, subprocess, tempfile

YUI_PATH = "yuicompressor-2.4.7.jar"
SRC_DIR = "../web/"
DST_DIR = "../build"
UNITS = [
    {
        "type": "css",
        "name": "style.css",
        "files": [
            "css/style.css",
        ]
    },
    {
        "type": "js",
        "name": "three.v56",
        "files": [
            "lib/three.v56.js",
        ],
        "minified": "lib/three.v56.min.js",
    },
    {
        "type": "js",
        "name": "torus-cycle",
        "anonCall": True,
        "files": [
            "js/values.js",
            "js/TorusCycle.js",
            "js/CameraController.js",
            "js/Computer.js",
            "js/GoalPost.js",
            "js/Ground.js",
            "js/LightCycle.js",
            "js/Player.js",
            "js/PlayerTrail.js",
            "js/Resources.js",
            "js/main.js",
        ],
        "config": "js/config.json"
    }
]
COPY = [
    ("textures", "textures"),
]

def yui(files, outputFile, type_, anonCall):
    fName = tempfile.mktemp()
    f = open(fName, "w")
    if anonCall:
        f.write("(function () {")
    for fPath in files:
        print fPath
        f.write(open(fPath).read())
        if anonCall:
            f.write("\n")
    if anonCall:
        f.write("}());")
    f.close()
    subprocess.call(["cp", fName, "/home/p/asdf.js"])
    subprocess.call(["java", "-jar", YUI_PATH, "-o", outputFile, "--type",
            type_, fName])

def buildUnit(unit, scripts, styles, srcDir, dstDir, minify):
    outputDir = os.path.join(dstDir, unit["type"])
    outputFormat = {
        "js": "<script src='%s'></script>",
        "css": "<link href='%s' rel='stylesheet'/>",
    }
    outputList = {
        "js": scripts,
        "css": styles,
    }
    unitType = unit["type"]

    try:
        os.makedirs(outputDir)
    except OSError:
        pass


    if minify:
        fileName = unit["name"].split(".")[0] + ".min." + unitType
        outputFile = os.path.join(outputDir, fileName)
        if unit.has_key("minified"):
            shutil.copyfile(os.path.join(srcDir, unit["minified"]), outputFile)
        else:
            files = [os.path.join(srcDir, x) for x in unit["files"]]
            anonCall = unit.has_key("anonCall") and unit["anonCall"]
            yui(files, outputFile, unitType, anonCall, unit)
        relativeFile = os.path.join(unitType, fileName)
        outputList[unitType].append(outputFormat[unitType] % relativeFile)
    else:
        #!!!!!!!!! FUCK YOU ALLLLLL!!
        if unit.has_key("config"):
            configJson = open(os.path.join(srcDir, unit["config"])).read()
            out = open(os.path.join(outputDir, "Config.js"), "w")
            out.write("Config = %s;\n" % configJson)
            out.close()
            outputList[unitType].append(outputFormat[unitType] % "js/Config.js")
        for file_ in unit["files"]:
            fileName = os.path.split(file_)[1].split(".")[0] + "." + unitType
            outputFile = os.path.join(outputDir, fileName)
            shutil.copyfile(os.path.join(srcDir, file_), outputFile)
            relativeFile = os.path.join(unitType, fileName)
            outputList[unitType].append(outputFormat[unitType] % relativeFile)

def clean(dstDir):
    try:
        shutil.rmtree(dstDir)
    except OSError:
        pass

def buildAll(srcDir, dstDir, units, copy, minify):
    clean(dstDir)
    os.makedirs(dstDir)

    scripts = []
    styles = []

    for unit in units:
        buildUnit(unit, scripts, styles, srcDir, dstDir, minify)

    index = open(os.path.join(srcDir, "index.html")).read()
    index = index.replace("{{SCRIPTS}}", "\n".join(scripts))
    index = index.replace("{{STYLES}}", "\n".join(styles))

    outIndex = open(os.path.join(dstDir, "index.html"), "w")
    outIndex.write(index)
    outIndex.close()

    for c in copy:
        shutil.copytree(os.path.join(srcDir, c[0]), os.path.join(dstDir, c[1]))
        
if __name__ == "__main__":
    if len(sys.argv) < 2:
        command = "all"
    else:
        command = sys.argv[1]

    minify = False
    for arg in sys.argv:
        if arg == "--minify":
            minify = True
            break

    if command == "all":
        buildAll(SRC_DIR, DST_DIR, UNITS, COPY, minify)
    elif command == "clean":
        clean(DST_DIR)
    else:
        sys.exit(1)
