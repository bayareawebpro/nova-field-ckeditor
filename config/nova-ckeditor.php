<?php
return [
    /**
     * Max Memory (php.ini override) for Intervention Image Resizing
     * @docs https://www.php.net/manual/en/ini.core.php#ini.memory-limit
     */
    'memory' => '256M',

    /**
     * Max Intervention Image Output Quality
     * before Image Optimizer is run.
     * @docs http://image.intervention.io/api/save
     */
    'max_quality' => 75,

    /**
     * Intervention Image Max Dimensions
     * @docs http://image.intervention.io/api/resize
     */
    'max_width' => 1024,
    'max_height' => 768,

    /**
     * Maximum characters before trimmed.
     * @docs https://stackoverflow.com/questions/6870824/what-is-the-maximum-length-of-a-filename-in-s3
     */
    'max_filename' => 250,
];
