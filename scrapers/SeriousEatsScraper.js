"use strict";

const BaseScraper = require("../helpers/BaseScraper");

/**
 * Class for scraping bbc.co
 * @extends BaseScraper
 */
class SeriousEatsScraper extends BaseScraper {
  constructor(url) {
    super(url, "seriouseats.com/");
    if (this.url && this.url.includes("seriouseats.com/sponsored/")) {
      throw new Error("seriouseats.com sponsored recipes not supported");
    }
  }

  scrape($) {
    this.defaultSetImage($);
    this.defaultSetDescription($);
    const { ingredients, instructions, time, tags } = this.recipe;
    this.recipe.name = $("#heading_1-0")
      .find(".heading__title")
      .text();

    $("#structured-ingredients_1-0")
      .find("ul p")
      .each((i, el) => {
        ingredients.push(this.textTrim($(el)));
      });

    if (ingredients.length === 0) // if no ingredients are found, try the old way
      $(".ingredient").each((i, el) => {
        ingredients.push(this.textTrim($(el)));
      });


    $("#link-list_1-0")
      .find("li a")
      .each((i, el) => {
        tags.push(this.textTrim($(el)));
      });

    $("#structured-project__steps_1-0")
      .find("ol p")
      .each((i, el) => {
        instructions.push(this.textTrim($(el)));
      });

    time.prep = this.textTrim($(".prep-time .meta-text__data")).replace(
      "\n",
      " "
    );

    time.active = this.textTrim($(".active-time .meta-text__data")).replace(
      "\n",
      " "
    );

    time.inactive = this.textTrim($(".custom-time .meta-text__data")).replace(
      "\n",
      " "
    );

    time.cook = this.textTrim($(".cook-time .meta-text__data")).replace(
      "\n",
      " "
    );

    time.total = this.textTrim($(".total-time .meta-text__data")).replace(
      "\n",
      " "
    );

    this.recipe.servings = this.textTrim(
      $(".recipe-serving .meta-text__data")
    ).replace("\n", " ");
  }
}

module.exports = SeriousEatsScraper;
