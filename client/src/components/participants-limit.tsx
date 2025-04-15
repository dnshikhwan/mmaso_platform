import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

type ParticipantLimitOption = "5" | "10" | "20" | "custom" | "unlimited";

interface ParticipantLimitSelectorProps {
    participantLimit: string;
    setParticipantLimit: (limit: string) => void;
}

export default function ParticipantLimitSelector({
    setParticipantLimit,
}: ParticipantLimitSelectorProps) {
    const [selectedLimit, setSelectedLimit] =
        useState<ParticipantLimitOption>("unlimited");
    const [customLimit, setCustomLimit] = useState<string>("30");

    const handleLimitChange = (value: ParticipantLimitOption) => {
        setSelectedLimit(value);

        if (value === "unlimited") {
            setParticipantLimit("0");
        } else if (value === "custom") {
            setParticipantLimit(customLimit);
        } else {
            setParticipantLimit(value);
        }
    };

    const handleCustomLimitChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.value;
        setCustomLimit(newValue);
        if (selectedLimit === "custom") {
            setParticipantLimit(newValue);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Participant Limit</Label>
            </div>

            <RadioGroup
                value={selectedLimit}
                onValueChange={handleLimitChange as (value: string) => void}
                className="space-y-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="limit-custom" />
                    <Label htmlFor="limit-custom">Custom:</Label>
                    <Input
                        type="number"
                        min="1"
                        value={customLimit}
                        onChange={handleCustomLimitChange}
                        className="w-24 ml-2"
                        disabled={selectedLimit !== "custom"}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unlimited" id="limit-unlimited" />
                    <Label htmlFor="limit-unlimited">No limit</Label>
                </div>
            </RadioGroup>
        </div>
    );
}
