import {BaseInteraction } from "discord.js";

export interface IBaseInteraction {
    name: string;
    description: string;
    execute: (interaction: BaseInteraction) => void;
}

