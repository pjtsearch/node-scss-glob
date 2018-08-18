                             __                                           __      __   
            ____  ____  ____/ /__        ____________________      ____  / /___  / /_ 
           / __ \/ __ \/ __  / _ \______/ ___/ ___/ ___/ ___/_____/ __ \/ / __ \/ __ \
          / / / / /_/ / /_/ /  __/_____(__  ) /__(__  |__  )_____/ /_/ / / /_/ / /_/ / 
         /_/ /_/\____/\__,_/\___/     /____/\___/____/____/      \__, /_/\____/_.___/
                                                                /____/

node-scss-glob is a lightweight, no dependency library that generates scss imports for entire folders from the command line.

### INSTALLATION:
    npm install -g node-scss-glob

### USAGE:
    node-scss-glob -o=<file> [-d=<directory> -I=<directory> -e=<file> -E=<directory> -a]

### OPTIONS:
|Arguement|Input                |Description                                                                                           |
|---------|---------------------|------------------------------------------------------------------------------------------------------|
|-o       |FILE                 |Selects output file of globbed imports.                                                               |
|-d       |[DIRECTORY...]       |Selects root directory to recursivly glob (brackets are required around the array, and not symbolic). |
|-e       |[FILE...]            |Selects files to exclude from globbing (brackets are required around the array, and not symbolic).    |
|-E       |[DIRECTORY...]       |Selects folders to exclude from globbing (brackets are required around the array, and not symbolic).  |
|-a       |No input,just a flag.|Option to add imports onto previously globbed.                                                        |
