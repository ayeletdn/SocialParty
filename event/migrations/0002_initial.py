# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Guest'
        db.create_table(u'event_guest', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'event', ['Guest'])

        # Adding model 'Product'
        db.create_table(u'event_product', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('required_quantity', self.gf('django.db.models.fields.IntegerField')(default=1)),
        ))
        db.send_create_signal(u'event', ['Product'])

        # Adding model 'Event'
        db.create_table(u'event_event', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('date', self.gf('django.db.models.fields.DateTimeField')()),
            ('place', self.gf('django.db.models.fields.CharField')(max_length=1000)),
        ))
        db.send_create_signal(u'event', ['Event'])

        # Adding model 'Attending'
        db.create_table(u'event_attending', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('guest', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Guest'])),
            ('event', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Event'])),
            ('product', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Product'])),
            ('quantity', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'event', ['Attending'])


    def backwards(self, orm):
        # Deleting model 'Guest'
        db.delete_table(u'event_guest')

        # Deleting model 'Product'
        db.delete_table(u'event_product')

        # Deleting model 'Event'
        db.delete_table(u'event_event')

        # Deleting model 'Attending'
        db.delete_table(u'event_attending')


    models = {
        u'event.attending': {
            'Meta': {'object_name': 'Attending'},
            'event': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Event']"}),
            'guest': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Guest']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Product']"}),
            'quantity': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'event.event': {
            'Meta': {'object_name': 'Event'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'guest_list': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['event.Guest']", 'through': u"orm['event.Attending']", 'symmetrical': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'place': ('django.db.models.fields.CharField', [], {'max_length': '1000'})
        },
        u'event.guest': {
            'Meta': {'object_name': 'Guest'},
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'event.product': {
            'Meta': {'object_name': 'Product'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'required_quantity': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        }
    }

    complete_apps = ['event']