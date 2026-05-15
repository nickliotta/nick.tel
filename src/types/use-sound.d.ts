declare module "use-sound" {
    type PlayFunction = (options?: {
        id?: string;
        forceSoundEnabled?: boolean;
        playbackRate?: number;
    }) => void;

    type ExposedData = {
        sound?: unknown;
        stop: (id?: string) => void;
        pause: (id?: string) => void;
        duration?: number;
    };

    type Options = {
        volume?: number;
        playbackRate?: number;
        interrupt?: boolean;
        soundEnabled?: boolean;
        sprite?: Record<string, [number, number]>;
        onload?: () => void;
        onplay?: () => void;
        onend?: () => void;
        onpause?: () => void;
        onstop?: () => void;
    };

    export default function useSound(
        src: string | string[],
        options?: Options
    ): [PlayFunction, ExposedData];
}