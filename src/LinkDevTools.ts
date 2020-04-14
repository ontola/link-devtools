/* globals $r */
/* eslint no-console: 0 */
/*
 Link devtools
 Copyright (C) 2019  Ontola

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import rdf, { isBlankNode, isNamedNode } from "@ontologies/core";
import * as RdfFactory from "@ontologies/core";
import * as LinkLib from 'link-lib';
import * as LinkRedux from 'link-redux';

declare var $r: any;
declare global {
  interface Window {
    LRS: LinkLib.LinkedRenderStore<any>;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    __LINK_DEVTOOLS_GLOBAL_HOOK__: any;
    dev: any & LinkDevTools;
  }
}

export class LinkDevTools {
  private readonly rDevTools: any;
  private readonly globalName: string;

  public readonly lrs: LinkRedux.LinkReduxLRSType;

  constructor(
    lrs = window.LRS,
    globalName = 'dev',
    enableExtension = false,
    reactDevTools = undefined
  ) {
    this.rDevTools = reactDevTools;
    this.globalName = globalName;
    this.lrs = lrs;

    if (process.env.NODE_ENV === "development") {
      window.__LINK_DEVTOOLS_GLOBAL_HOOK__ = {
        factory: new RdfFactory.PlainFactory(),
        deltaProcessor: (delta) => {
          window.postMessage({
            extension: "link-devtools",
            type: "delta",
            data: delta,
          }, "*");
          window.postMessage({
            extension: "link-devtools",
            type: "data",
            data: (lrs as any)
              .store
              .store
              .quads
              .map((s) => window.__LINK_DEVTOOLS_GLOBAL_HOOK__.factory.fromQuad(s)),
          }, "*");
        },
      };

      if (enableExtension) {
        this.lrs.deltaProcessors.unshift({
          flush(): RdfFactory.Quad[] {
            return [];
          },

          queueDelta(delta: RdfFactory.Quadruple[], subjects: number[]): void {},

          processDelta(delta: RdfFactory.Quadruple[]): RdfFactory.Quad[] {
            window.__LINK_DEVTOOLS_GLOBAL_HOOK__.deltaProcessor(delta);
            return [];
          },
        });
      }
    }
  }

  get $r() {
    if (typeof $r !== 'undefined') {
      return $r;
    }

    return this.rDevTools;
  }

  /**
   * Get the LRS bound to the component.
   * @param {React.Element} comp Component to get the LRS from.
   * @return {LinkedRenderStore|undefined} Resolved LinkedRenderStore if any.
   */
  public getLRS(comp = this.$r) {
    const lrs = comp?.hooks.find(a => a.name === "LRS")?.subHooks?.[0];

    return lrs?.value || this.lrs || window.LRS;
  }

  static returnWithError(msg = undefined) {
    return console.error(`${msg ? `${msg}, i` : 'I'}s a link component selected? (check the value of \`$r\`)`);
  }

  dataArr(comp = this.$r) {
    const subject = this.currentSubject(comp);
    if (typeof subject === 'undefined') {
      return LinkDevTools.returnWithError('No subject or object found (check the value of `$r`)');
    }

    return this.lrs.tryEntity(subject);
  }

  showProp(func) {
    return (comp = this.$r) => {
      if (typeof comp === 'undefined') {
        return console.error('No component selected in react devtools (check the value of `$r`)');
      }
      if (typeof comp.props === 'undefined') {
        return LinkDevTools.returnWithError('Object has no props');
      }
      if (typeof comp.props.label === 'undefined') {
        return LinkDevTools.returnWithError('Component `label` is undefined');
      }
      if (typeof comp.props.subject === 'undefined') {
        return LinkDevTools.returnWithError('Component `subject` is undefined');
      }
      const lrs = this.getLRS(comp);

      console.debug('Using: ', comp.props.label, comp.props.subject, lrs ? 'local LRS' : 'global LRS');

      return func(comp.props.subject, comp.props.label);
    };
  }

  toObject(arr: RdfFactory.Quad[] | void = this.dataArr(), denormalize = true) {
    if (!Array.isArray(arr)) {
      return console.error('Pass an array of statements to process');
    }
    if (arr.length === 0) {
      console.debug('No statements passed');

      return {};
    }
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const cur = arr[i];
      const subj = rdf.toNQ(cur.subject);
      const pred = rdf.toNQ(cur.predicate);
      if (typeof obj[subj] === 'undefined') {
        obj[subj] = {};
      }
      if (typeof obj[subj][pred] === 'undefined') {
        obj[subj][pred] = cur.object;
      } else if (Array.isArray(obj[subj][pred])) {
        obj[subj][pred].push(cur.object);
      } else {
        obj[subj][pred] = [
          obj[subj][pred],
          cur.object,
        ];
      }
    }
    const allKeys = Object.keys(obj);
    if (denormalize && allKeys.length === 1) {
      console.debug('Returning single subject;', allKeys[0]);

      return obj[allKeys[0]];
    }

    return obj;
  }

  obj(resource) {
    const lrs = this.getLRS();
    let node = resource;
    if (typeof resource === 'number') {
      node = rdf.fromId(resource);
    } else if (typeof resource === 'string') {
      node = rdf.namedNode(resource);
    }

    return this.toObject(lrs.tryEntity(node));
  }

  get data() {
    return this.toObject(this.dataArr());
  }

  get getPropArr() {
    return this.showProp(this.getResourceProperty);
  }

  get getPropRawArr() {
    return this.showProp(this.getResourcePropertyRaw);
  }

  get getProp() {
    const propVal = this.getPropArr;

    return Array.isArray(propVal) ? this.toObject(propVal) : propVal;
  }

  get getPropRaw() {
    const propVal = this.getPropRawArr;

    return Array.isArray(propVal) ? this.toObject(propVal) : propVal;
  }

  // eslint-disable-next-line class-methods-use-this
  get linkLib() {
    return LinkLib;
  }

  // eslint-disable-next-line class-methods-use-this
  get linkRedux() {
    return LinkRedux;
  }

  get rdf() {
    return rdf;
  }

  get createNS() {
    return RdfFactory.createNS;
  }

  get rdfFactory() {
    return RdfFactory;
  }

  get reload() {
    if (this.$r && this.$r.props) {
      if (!this.$r.props.reloadLinkedObject) {
        return console.warn("Selected node doesn't seem to be a LinkedResourceContainer");
      }

      return this.$r.props.reloadLinkedObject();
    }

    return console.warn('No node or wrong node type selected.');
  }

  get topology() {
    return this.$r.props.topology === null
      ? undefined
      : (this.$r.props.topology || this.$r.props.topologyCtx);
  }

  get propertyRenderers() {
    return this.getLRS(this.$r).mapping;
  }

  get typeRenderers() {
    return this.getLRS(this.$r).mapping['<http://purl.org/link-lib/typeRenderClass>'];
  }

  get help() {
    function helpTableObj(method, desc) {
      return {
        desc,
        method,
      };
    }

    console.warn('__DO NOT__ USE THESE METHODS IN CODE SINCE ARE FOR DEBUGGING PURPOSES ONLY.');
    console.group('Available object methods for LinkedResourceContainer');
    const LRC = [
      helpTableObj('<<static>> hasErrors', 'Returns whether the resource is considered to be in an error state'),
      helpTableObj('onError', 'Returns the component to render on error'),
      helpTableObj('onLoad', 'Returns the component to render on load'),
      helpTableObj('data', 'Returns the currently available data (real-time, so render-time data theoretically might differ).'),
      helpTableObj('obj', 'Same as data, but can be passed an argument.'),
      helpTableObj('objType', 'Returns the resolved type of the resource, defaults to the lrs value.'),
      helpTableObj('subject', 'Returns the normalized subject of the container'),
      helpTableObj('topology', 'Returns the current topology (or undefined when not present)'),
    ];
    console.table(LRC, ['method', 'desc']);
    console.groupEnd();
    console.info('Property and others are purely functional, so this module exposes additional methods which can be used to inspect those components');
    console.group(`Available object methods for devTools (via \`${this.globalName}.<attribute>\`)`);
    console.info('Most methods work on react-devtools object references (using value of `$r`)');
    const devTools = [
      helpTableObj('data', 'Returns the currently available data as an object (real-time, so render-time data theoretically might differ).'),
      helpTableObj('obj', 'Same as data, but can be passed an argument.'),
      helpTableObj('dataArr', 'Returns the raw currently available data (See also; `data`).'),
      helpTableObj('getResourceProperty()', "Exposes link-redux's `getResourceProperty` method (used by `Property` and `PropertyBase`)."),
      helpTableObj('getResourcePropertyRaw()', "Exposes link-redux's `getResourceProperty` method (used by `Property` and `PropertyBase`)."),
      helpTableObj('getPropArr', "Returns the component's 'object property' without using `toObject`."),
      helpTableObj('getPropRawArr', "Returns the component's 'object property' without using `toObject`."),
      helpTableObj('getProp', "Returns the component's formatted 'object property' by using `getResourceProperty`."),
      helpTableObj('getPropRaw', "Returns the component's formatted 'object property' by using `getResourcePropertyRaw`."),
      helpTableObj('help', 'Displays this help message.'),
      helpTableObj('reload', 'Reloads the currently selected LRC (if possible).'),
      helpTableObj('toObject(arr)', 'Converts an array of statements to an object.'),
      helpTableObj('topology', "Returns the current location's topology."),
      helpTableObj('types', ''),
      helpTableObj('typeRenderers', 'Returns all registered type renderers.'),
      helpTableObj('propertyRenderers', 'Returns all registered property renderers (including type renderers).'),
    ];
    console.table(devTools, ['method', 'desc']);
    console.groupEnd();

    return undefined;
  }

  getResourceProperty(property, subject, lrs) {
    return (lrs || this.getLRS()).getResourceProperty(
      property,
      subject
    );
  }

  getResourcePropertyRaw(subject, property, lrs) {
    return (lrs || this.getLRS()).getResourcePropertyRaw(
      subject,
      property
    );
  }

  private currentSubject(comp): RdfFactory.NamedNode {
    if (typeof comp === 'undefined') {
      throw console.error('No component selected in react devtools (check the value of `$r`)');
    }
    let subject;
    if (isNamedNode(comp) || isBlankNode(comp)) {
      subject = comp;
    } else {
      if (typeof comp.props !== 'undefined') {
        subject = comp.props.subject;
      }
      if (typeof subject === 'undefined' && typeof comp.hooks !== 'undefined') {
        subject = $r.hooks.find(a => a.name === "LinkRenderContext")?.subHooks?.[0]?.value?.subject;
      }
    }

    if (typeof subject === 'string') {
      console.debug('Normalizing passed subject into NamedNode');
      subject = rdf.namedNode(subject);
    }

    return subject;
  }
}

const enableDevtools = (lrs: LinkRedux.LinkReduxLRSType, globalName: string = 'dev') => {
  if (typeof window !== 'undefined') {
    const devtools = new LinkDevTools(lrs, globalName, false);

    if (process.env.NODE_ENV === 'development') {
      window[globalName] = devtools;
    }
  }
};

export default enableDevtools;
