                             __                                           __      __   
            ____  ____  ____/ /__        ____________________      ____  / /___  / /_ 
           / __ \/ __ \/ __  / _ \______/ ___/ ___/ ___/ ___/_____/ __ \/ / __ \/ __ \
          / / / / /_/ / /_/ /  __/_____(__  ) /__(__  |__  )_____/ /_/ / / /_/ / /_/ / 
         /_/ /_/\____/\__,_/\___/     /____/\___/____/____/      \__, /_/\____/_.___/
                                                                /____/

node-scss-glob is a lightweight, no dependency library that generates scss imports for entire folders from the command line.
 
### USAGE:
    node-scss-glob -o=<file> [-d=<directory> -I=<directory> -e=<file> -E=<directory> -a]

### OPTIONS:
<pre>
  -o=FILE
      selects output file of globbed imports.
  -d=[DIRECTORY...]
      selects root directory to recursivly glob (brackets are required around the array, and not symbolic).
  -e=[FILE...]
      selects files to exclude from globbing (brackets are required around the array, and not symbolic).
  -E=[DIRECTORY...]
      selects folders to exclude from globbing (brackets are required around the array, and not symbolic).
  -a
      option to add imports onto previously globbed.
</pre>
