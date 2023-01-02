const PLANKA_LABEL_COLORS = [
    'berry-red',
    'pumpkin-orange',
    'lagoon-blue',
    'pink-tulip',
    'light-mud',
    'orange-peel',
    'bright-moss',
    'antique-blue',
    'dark-granite',
    'lagune-blue',
    'sunny-grass',
    'morning-sky',
    'light-orange',
    'midnight-blue',
    'tank-green',
    'gun-metal',
    'wet-moss',
    'red-burgundy',
    'light-concrete',
    'apricot-red',
    'desert-sand',
    'navy-blue',
    'egg-yellow',
    'coral-green',
    'light-cocoa',
];

const getPlankaLabelColor = (trelloLabelColor) => 
    PLANKA_LABEL_COLORS.find((color) => color.indexOf(trelloLabelColor) !== -1) || 'desert-sand';

exports.getPlankaLabelColor = getPlankaLabelColor;