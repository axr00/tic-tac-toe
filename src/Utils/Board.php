<?php

declare(strict_types = 1);

namespace App\Utils;

use DOMDocument;

class Board {

    public function __construct() {

    }

    public function drawBoard(): void {
        $dom = new DOMDocument;
        $canvas = $dom->getElementById('canvas');
    }
}