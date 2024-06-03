import ValidationLayer from "../base/ValidationLayer";
import { signalZs3OrLf7, signalHasDirection, signalBetweenWays, signalOnStartAndEndOfWay, speedDefined } from "./rules/rules";

const speedValidation = new ValidationLayer({
    tags: {
        "speed_limit": {
            rules: [
                signalZs3OrLf7,
                signalHasDirection,
                signalBetweenWays,
                signalOnStartAndEndOfWay,
                speedDefined
            ],
        }
    }
});

export default speedValidation;